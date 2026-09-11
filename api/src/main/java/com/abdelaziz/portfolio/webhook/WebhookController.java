package com.abdelaziz.portfolio.webhook;

import java.io.IOException;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdelaziz.portfolio.sync.ProjectSyncService;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * GitHub webhook entrypoint ({@code POST /api/webhooks/github}).
 *
 * <ul>
 *   <li>{@code ping} → 200, recorded.</li>
 *   <li>{@code push} touching {@code .portfolio.json} or cover assets → 202,
 *       recorded as {@code accepted} (sync runs inline; failures are logged
 *       and surface via the admin re-sync endpoint).</li>
 *   <li>Anything else → 200, recorded as {@code ignored}.</li>
 *   <li>Retried deliveries ({@code X-GitHub-Delivery} seen before) → 200
 *       {@code duplicate}, no double processing.</li>
 * </ul>
 */
@RestController
@RequestMapping("/webhooks/github")
public class WebhookController {

    private final WebhookVerifier verifier;
    private final WebhookDeliveryRepository deliveries;
    private final ProjectSyncService sync;
    private final ObjectMapper mapper;

    private static final Logger log = LoggerFactory.getLogger(WebhookController.class);

    public WebhookController(
            WebhookVerifier verifier,
            WebhookDeliveryRepository deliveries,
            ProjectSyncService sync,
            ObjectMapper mapper) {
        this.verifier = verifier;
        this.deliveries = deliveries;
        this.sync = sync;
        this.mapper = mapper;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> receive(
            @RequestHeader(value = "X-Hub-Signature-256", required = false) String signature,
            @RequestHeader(value = "X-GitHub-Event", required = false) String event,
            @RequestHeader(value = "X-GitHub-Delivery", required = false) String deliveryId,
            @RequestBody byte[] body) {

        // Fail closed with 401 (not Spring's default 400) when the
        // signature or event headers are absent.
        if (signature == null || event == null || !verifier.valid(signature, body)) {
            return status(HttpStatus.UNAUTHORIZED, "error", "invalid signature");
        }

        final JsonNode payload;
        try {
            payload = mapper.readTree(body);
        } catch (IOException e) {
            return status(HttpStatus.BAD_REQUEST, "error", "payload is not JSON");
        }

        // Duplicate guard runs before any branch (including ping): retried
        // deliveries must never hit the PK insert twice.
        if (deliveryId != null && deliveries.existsById(deliveryId)) {
            return status(HttpStatus.OK, "status", "duplicate");
        }

        if ("ping".equals(event)) {
            record(deliveryId, event, null, "ping");
            return status(HttpStatus.OK, "status", "pong");
        }

        String repo = WebhookPushInspector.repoFullName(payload);
        String action = "push".equals(event) && repo != null
                && WebhookPushInspector.touchesPortfolioFiles(payload)
                        ? "accepted"
                        : "ignored";
        try {
            record(deliveryId, event, repo, action);
        } catch (DataIntegrityViolationException e) {
            // Lost a concurrent-delivery race; the other thread owns it.
            return status(HttpStatus.OK, "status", "duplicate");
        }

        if (!"accepted".equals(action)) {
            return status(HttpStatus.OK, "status", "ignored");
        }
        // Sync failures must not fail the delivery (GitHub would retry into a
        // duplicate); they surface via logs and the admin re-sync endpoint.
        try {
            sync.sync(repo, WebhookPushInspector.headSha(payload));
        } catch (RuntimeException e) {
            log.warn("Sync failed for {}: {}", repo, e.getMessage());
        }
        return status(HttpStatus.ACCEPTED, "status", "accepted");
    }

    private void record(String deliveryId, String event, String repo, String action) {
        if (deliveryId != null) {
            deliveries.save(new WebhookDelivery(deliveryId, event, repo, action));
        }
    }

    private static ResponseEntity<Map<String, String>> status(HttpStatus code, String key, String value) {
        return ResponseEntity.status(code).body(Map.of(key, value));
    }
}
