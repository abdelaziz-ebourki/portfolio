package com.abdelaziz.portfolio.sync;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.abdelaziz.portfolio.github.GitHubClient;
import com.abdelaziz.portfolio.manifest.InvalidManifestException;
import com.abdelaziz.portfolio.manifest.ManifestValidator;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class ProjectSyncServiceTest {

    @Mock
    private GitHubClient github;

    @Mock
    private ProjectRepository projects;

    private final ManifestValidator validator = new ManifestValidator(new ObjectMapper());

    private ProjectSyncService sync;

    @org.junit.jupiter.api.BeforeEach
    void wireService() {
        sync = new ProjectSyncService(github, validator, projects, new ObjectMapper());
    }

    @Test
    void importsNewProjectWithCoverBytesEnriched() {
        when(github.fetchManifest("example/taskboard", "main"))
                .thenReturn(new GitHubClient.TextFile(fixture("manifest-valid.json"), "blob1"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", "main"))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 1, 2, 3 }, "image/png", "blobcover"));
        when(projects.findByRepoFullName("example/taskboard")).thenReturn(Optional.empty());
        when(projects.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Project project = sync.sync("example/taskboard", "main");

        assertThat(project.getSlug()).isEqualTo("taskboard");
        assertThat(project.getSyncedSha()).contains("blob1");
        ArgumentCaptor<Project> saved = ArgumentCaptor.forClass(Project.class);
        verify(projects).save(saved.capture());
        assertThat(saved.getValue().getManifest()).contains("\"data\":\"AQID\"");
        assertThat(saved.getValue().getManifest()).contains("\"contentType\":\"image/png\"");
    }

    @Test
    void coercesCoverKindToRealContentType() {
        when(github.fetchManifest("example/taskboard", null))
                .thenReturn(new GitHubClient.TextFile(fixture("manifest-valid.json"), "blob2"));
        // Manifest declares kind image for docs/cover.png; bytes are really a video.
        when(github.fetchCover("example/taskboard", "docs/cover.png", null))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 0 }, "video/mp4", "blobcover"));
        when(projects.findByRepoFullName("example/taskboard")).thenReturn(Optional.empty());
        when(projects.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Project project = sync.sync("example/taskboard", null);

        assertThat(project.getManifest()).contains("\"kind\":\"video\"");
    }

    @Test
    void skipsWriteWhenBlobShaUnchanged() {
        Project stored = new Project("example/taskboard", "taskboard", "{}", "blob1");
        when(github.fetchManifest("example/taskboard", "abc123"))
                .thenReturn(new GitHubClient.TextFile(fixture("manifest-valid.json"), "blob1"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", "abc123"))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 1 }, "image/png", "blobcover"));
        when(projects.findByRepoFullName("example/taskboard")).thenReturn(Optional.of(stored));

        assertThat(sync.sync("example/taskboard", "abc123")).isSameAs(stored);
        verify(projects, never()).save(any());
    }

    @Test
    void rejectsInvalidManifestWithoutWriting() {
        when(github.fetchManifest("example/broken", null))
                .thenReturn(new GitHubClient.TextFile("{\"slug\": 42}", null));

        assertThatThrownBy(() -> sync.sync("example/broken", null))
                .isInstanceOf(InvalidManifestException.class);
        verify(projects, never()).save(any());
    }

    @Test
    void coerceKindFallsBackToDeclaredForUnknownTypes() {
        assertThat(ProjectSyncService.coerceKind("image", "image/gif")).isEqualTo("gif");
        assertThat(ProjectSyncService.coerceKind("image", "video/webm")).isEqualTo("video");
        assertThat(ProjectSyncService.coerceKind("image", "image/jpeg")).isEqualTo("image");
        assertThat(ProjectSyncService.coerceKind("video", "application/octet-stream")).isEqualTo("video");
    }

    private static String fixture(String name) {
        try (var in = ProjectSyncServiceTest.class.getResourceAsStream("/fixtures/" + name)) {
            if (in == null) {
                throw new IllegalStateException("Missing fixture: " + name);
            }
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
