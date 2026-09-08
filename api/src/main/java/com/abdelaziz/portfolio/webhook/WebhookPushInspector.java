package com.abdelaziz.portfolio.webhook;

import java.util.regex.Pattern;

import com.fasterxml.jackson.databind.JsonNode;

/**
 * Decides whether a GitHub {@code push} payload can affect portfolio data.
 * Sync is idempotent (guarded by {@code synced_sha}), so this is a cheap
 * pre-filter, not a correctness gate: the manifest itself plus any plausible
 * cover asset (image/video under any path) trigger a sync.
 */
final class WebhookPushInspector {

    private static final String MANIFEST_PATH = ".portfolio.json";

    private static final Pattern COVER_ASSET =
            Pattern.compile("\\.(png|jpe?g|gif|webp|avif|mp4|webm)$", Pattern.CASE_INSENSITIVE);

    private WebhookPushInspector() {
    }

    static boolean touchesPortfolioFiles(JsonNode push) {
        JsonNode commits = push.path("commits");
        if (!commits.isArray()) {
            return false;
        }
        for (JsonNode commit : commits) {
            for (String field : new String[] { "added", "modified", "removed" }) {
                JsonNode files = commit.path(field);
                if (!files.isArray()) {
                    continue;
                }
                for (JsonNode file : files) {
                    String path = file.asText("");
                    if (MANIFEST_PATH.equals(path) || COVER_ASSET.matcher(path).find()) {
                        return true;
                    }
                }
            }
        }
        return false;
    }

    static String repoFullName(JsonNode push) {
        return push.path("repository").path("full_name").asText(null);
    }

    static String headSha(JsonNode push) {
        String after = push.path("after").asText(null);
        return after != null ? after : push.path("head_commit").path("id").asText(null);
    }
}
