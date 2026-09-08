package com.abdelaziz.portfolio.projects;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Stored manifest → UI {@code ProjectDto}. The stored manifest carries the
 * fetched cover bytes ({@code cover.data}, {@code cover.contentType}) and the
 * repo-relative {@code cover.path}; none of that leaks — the DTO exposes a
 * single {@code cover.url} served by this API (or {@code cover: null}).
 */
public final class ProjectMapper {

    private ProjectMapper() {
    }

    public static ObjectNode toDto(ObjectMapper mapper, String slug, String storedManifest) {
        final JsonNode stored;
        try {
            stored = mapper.readTree(storedManifest);
        } catch (Exception e) {
            throw new IllegalStateException("Stored manifest for " + slug + " is not JSON", e);
        }
        ObjectNode dto = stored.isObject() ? ((ObjectNode) stored).deepCopy() : mapper.createObjectNode();

        JsonNode cover = dto.path("cover");
        if (cover.isObject()) {
            ObjectNode out = mapper.createObjectNode();
            out.put("url", "/api/projects/" + slug + "/cover");
            out.set("alt", cover.path("alt"));
            out.put("kind", cover.path("kind").asText("image"));
            dto.set("cover", out);
        } else {
            dto.putNull("cover");
        }
        if (!dto.has("featured")) {
            dto.put("featured", false);
        }
        if (!dto.has("displayOrder")) {
            dto.put("displayOrder", 0);
        }
        return dto;
    }
}
