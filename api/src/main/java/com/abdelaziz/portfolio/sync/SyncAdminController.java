package com.abdelaziz.portfolio.sync;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.regex.Pattern;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdelaziz.portfolio.github.GitHubClientException;
import com.abdelaziz.portfolio.github.GitHubFileNotFoundException;
import com.abdelaziz.portfolio.manifest.InvalidManifestException;

/**
 * Manual backfill/recovery: {@code POST /api/admin/sync {"repo":
 * "owner/name", "ref": "main"}}. Guarded by a shared {@code ADMIN_TOKEN}
 * bearer secret; fail-closed when unconfigured.
 */
@RestController
@RequestMapping("/admin")
public class SyncAdminController {

    private static final Pattern REPO = Pattern.compile("^[\\w.-]+/[\\w.-]+$");

    private final ProjectSyncService sync;
    private final String adminToken;

    public SyncAdminController(
            ProjectSyncService sync, @Value("${admin.token:}") String adminToken) {
        this.sync = sync;
        this.adminToken = adminToken == null ? "" : adminToken;
    }

    public record SyncRequest(String repo, String ref) {
    }

    @PostMapping(value = "/sync", consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> sync(
            @RequestHeader(value = "Authorization", required = false) String authorization,
            @RequestBody SyncRequest request) {

        if (adminToken.isBlank()) {
            return error(HttpStatus.SERVICE_UNAVAILABLE, "admin sync is not configured");
        }
        byte[] expected = ("Bearer " + adminToken).getBytes(StandardCharsets.UTF_8);
        byte[] actual = authorization == null ? new byte[0] : authorization.getBytes(StandardCharsets.UTF_8);
        if (!MessageDigest.isEqual(expected, actual)) {
            return error(HttpStatus.UNAUTHORIZED, "invalid admin token");
        }
        if (request == null || request.repo() == null || !REPO.matcher(request.repo()).matches()) {
            return error(HttpStatus.BAD_REQUEST, "repo must look like owner/name");
        }

        try {
            Project project = sync.sync(request.repo(), request.ref());
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("slug", project.getSlug());
            body.put("syncedSha", project.getSyncedSha().orElse(null));
            body.put("hasCover", project.getManifest().contains("\"cover\""));
            return ResponseEntity.ok(body);
        } catch (InvalidManifestException e) {
            Map<String, Object> body = new LinkedHashMap<>();
            body.put("error", e.getMessage());
            body.put("violations", e.violations());
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(body);
        } catch (GitHubFileNotFoundException e) {
            return error(HttpStatus.NOT_FOUND, e.getMessage());
        } catch (GitHubClientException e) {
            return error(HttpStatus.BAD_GATEWAY, e.getMessage());
        }
    }

    private static ResponseEntity<Map<String, Object>> error(HttpStatus code, String message) {
        return ResponseEntity.status(code).body(Map.of("error", message));
    }
}
