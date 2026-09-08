package com.abdelaziz.portfolio.projects;

import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.util.HexFormat;
import java.util.List;
import java.util.Map;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.CacheControl;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public read API: {@code GET /api/projects} (ordered {@code ProjectDto}
 * list, the exact seam the UI's future {@code fetch} plugs into) and
 * {@code GET /api/projects/{slug}/cover} (stored cover bytes with ETag
 * caching).
 */
@RestController
@RequestMapping("/projects")
public class ProjectController {

    private static final Logger log = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectCatalog catalog;

    public ProjectController(ProjectCatalog catalog) {
        this.catalog = catalog;
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public List<Map<String, Object>> list() {
        return catalog.list();
    }

    @GetMapping("/{slug}/cover")
    public ResponseEntity<byte[]> cover(
            @PathVariable String slug,
            @RequestHeader(value = "If-None-Match", required = false) String ifNoneMatch) {
        var asset = catalog.cover(slug);
        if (asset.isEmpty() || asset.get().bytes().length == 0) {
            return ResponseEntity.notFound().build();
        }
        String etag = "\"" + sha256Hex(asset.get().bytes()) + "\"";
        if (etag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).eTag(etag).build();
        }
        MediaType contentType;
        try {
            contentType = MediaType.parseMediaType(asset.get().contentType());
        } catch (Exception e) {
            log.warn("Stored content type for {} is invalid: {}", slug, asset.get().contentType());
            contentType = MediaType.APPLICATION_OCTET_STREAM;
        }
        return ResponseEntity.ok()
                .eTag(etag)
                .cacheControl(CacheControl.maxAge(java.time.Duration.ofHours(1)).cachePublic())
                .contentType(contentType)
                .body(asset.get().bytes());
    }

    private static String sha256Hex(byte[] bytes) {
        try {
            return HexFormat.of().formatHex(MessageDigest.getInstance("SHA-256").digest(bytes));
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("SHA-256 unavailable", e);
        }
    }
}
