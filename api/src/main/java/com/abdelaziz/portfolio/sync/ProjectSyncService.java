package com.abdelaziz.portfolio.sync;

import java.util.Base64;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.abdelaziz.portfolio.github.GitHubClient;
import com.abdelaziz.portfolio.manifest.ManifestValidator;
import com.fasterxml.jackson.databind.node.ObjectNode;

/**
 * Fetches {@code .portfolio.json} (+ cover) from a repo and upserts the
 * {@code projects} row. Idempotent: {@code synced_sha} tracks the manifest
 * blob SHA (a content hash), so re-syncing unchanged content is a no-op.
 * Invalid manifests never touch stored data.
 */
@Service
public class ProjectSyncService {

    private static final Logger log = LoggerFactory.getLogger(ProjectSyncService.class);

    private final GitHubClient github;
    private final ManifestValidator validator;
    private final ProjectRepository projects;

    public ProjectSyncService(
            GitHubClient github, ManifestValidator validator, ProjectRepository projects) {
        this.github = github;
        this.validator = validator;
        this.projects = projects;
    }

    @Transactional
    public Project sync(String repoFullName, String ref) {
        GitHubClient.TextFile manifestFile = github.fetchManifest(repoFullName, ref);

        // Cheap no-op first: an unchanged blob skips validation, cover
        // download and writes entirely (saves GitHub rate-limit).
        var existing = projects.findByRepoFullName(repoFullName);
        if (existing.isPresent() && existing.get().getSyncedSha()
                .map(stored -> stored.equals(manifestFile.sha())).orElse(false)) {
            log.debug("Sync skipped for {}: manifest blob {} unchanged", repoFullName, manifestFile.sha());
            return existing.get();
        }

        ObjectNode manifest = requireObject(validator.requireValid(manifestFile.content()));
        String slug = manifest.path("slug").asText();

        enrichCover(repoFullName, ref, manifest);
        String stored = manifest.toString();

        if (existing.isPresent()) {
            existing.get().refresh(slug, stored, manifestFile.sha());
            log.info("Synced {} (slug={}, blob={})", repoFullName, slug, manifestFile.sha());
            return existing.get();
        }
        log.info("Imported {} (slug={}, blob={})", repoFullName, slug, manifestFile.sha());
        return projects.save(new Project(repoFullName, slug, stored, manifestFile.sha()));
    }

    /**
     * Downloads the cover asset into {@code cover.data} (base64) and coerces
     * {@code cover.kind} to the real content type, so a mislabeled manifest
     * can never break the UI's hover-play. A missing cover asset fails the
     * whole sync — explicit beats silently cover-less.
     */
    private static ObjectNode requireObject(com.fasterxml.jackson.databind.JsonNode node) {
        if (!node.isObject()) {
            throw new IllegalStateException("Validated manifest is not a JSON object");
        }
        return (ObjectNode) node;
    }

    private void enrichCover(String repoFullName, String ref, ObjectNode manifest) {
        if (!manifest.has("cover")) {
            return;
        }
        if (!manifest.path("cover").isObject()) {
            throw new IllegalStateException("Manifest cover is not a JSON object");
        }
        ObjectNode cover = (ObjectNode) manifest.path("cover");
        String path = cover.path("path").asText();
        GitHubClient.BinaryFile asset = github.fetchCover(repoFullName, path, ref);
        cover.put("data", Base64.getEncoder().encodeToString(asset.bytes()));
        cover.put("contentType", asset.contentType());
        cover.put("kind", coerceKind(asset.contentType()));
    }

    static String coerceKind(String contentType) {
        if ("image/gif".equalsIgnoreCase(contentType)) {
            return "gif";
        }
        if (contentType != null && contentType.toLowerCase().startsWith("video/")) {
            return "video";
        }
        return "image";
    }
}
