package com.abdelaziz.portfolio.webhook;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * GitHub webhook entrypoint ({@code POST /api/webhooks/github}).
 *
 * <ul>
 *   <li>{@code ping} → 200, recorded.</li>
 *   <li>{@code push} touching {@code .portfolio.json} or cover assets → 202,
 *       recorded as {@code accepted} (phase 3 wires in the actual sync).</li>
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
    private final ObjectMapper mapper = new ObjectMapper();

    public WebhookController(WebhookVerifier verifier, WebhookDeliveryRepository deliveries) {
        this.verifier = verifier;
        this.deliveries = deliveries;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> receive(
            @RequestHeader("X-Hub-Signature-256") String signature,
            @RequestHeader("X-GitHub-Event") String event,
            @RequestHeader(value = "X-GitHub-Delivery", required = false) String deliveryId,
            @RequestBody byte[] body) {

        if (!verifier.valid(signature, body)) {
            return status(HttpStatus.UNAUTHORIZED, "error", "invalid signature");
        }

        final JsonNode payload;
        try {
            payload = mapper.readTree(body);
        } catch (IOException e) {
            return status(HttpStatus.BAD_REQUEST, "error", "payload is not JSON");
        }

        if ("ping".equals(event)) {
            record(deliveryId, event, null, "ping");
            return status(HttpStatus.OK, "status", "pong");
        }

        if (deliveryId != null && deliveries.existsById(deliveryId)) {
            return status(HttpStatus.OK, "status", "duplicate");
        }

        String repo = WebhookPushInspector.repoFullName(payload);
        String action = "push".equals(event) && WebhookPushInspector.touchesPortfolioFiles(payload)
                ? "accepted"
                : "ignored";
        record(deliveryId, event, repo, action);

        // Phase 3: accepted pushes trigger ProjectSyncService.sync(repo, sha).
        return "accepted".equals(action)
                ? status(HttpStatus.ACCEPTED, "status", "accepted")
                : status(HttpStatus.OK, "status", "ignored");
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
