package com.abdelaziz.portfolio.sync;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

/**
 * One synced project repo. {@code manifest} holds the validated
 * {@code .portfolio.json} enriched with the fetched cover bytes
 * ({@code cover.data} base64 + {@code cover.contentType}); the read API
 * strips the bytes back out when serving.
 */
@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(name = "repo_full_name", nullable = false, unique = true)
    private String repoFullName;

    @Column(nullable = false, unique = true)
    private String slug;

    @Column(columnDefinition = "jsonb", nullable = false)
    @JdbcTypeCode(SqlTypes.JSON)
    private String manifest;

    @Column(name = "synced_sha", columnDefinition = "varchar(40)")
    @JdbcTypeCode(SqlTypes.CHAR)
    private String syncedSha;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt;

    protected Project() {
    }

    public Project(String repoFullName, String slug, String manifest, String syncedSha) {
        this.repoFullName = repoFullName;
        this.slug = slug;
        this.manifest = manifest;
        this.syncedSha = syncedSha;
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    void stampUpdatedAt() {
        updatedAt = Instant.now();
    }

    public String getSlug() {
        return slug;
    }

    public String getManifest() {
        return manifest;
    }

    public Optional<String> getSyncedSha() {
        return Optional.ofNullable(syncedSha);
    }

    public void refresh(String slug, String manifest, String syncedSha) {
        this.slug = slug;
        this.manifest = manifest;
        this.syncedSha = syncedSha;
    }
}
