package com.abdelaziz.portfolio.sync;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.abdelaziz.portfolio.Fixtures;
import com.abdelaziz.portfolio.github.GitHubClient;
import com.abdelaziz.portfolio.github.GitHubClientException;
import com.abdelaziz.portfolio.github.GitHubFileNotFoundException;
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
        sync = new ProjectSyncService(github, validator, projects);
    }

    @Test
    void importsNewProjectWithCoverBytesEnriched() {
        when(github.fetchManifest("example/taskboard", "main"))
                .thenReturn(new GitHubClient.TextFile(Fixtures.read("manifest-valid.json"), "blob1"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", "main"))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 1, 2, 3 }, "image/png"));
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
                .thenReturn(new GitHubClient.TextFile(Fixtures.read("manifest-valid.json"), "blob2"));
        // Manifest declares kind image for docs/cover.png; bytes are really a video.
        when(github.fetchCover("example/taskboard", "docs/cover.png", null))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 0 }, "video/mp4"));
        when(projects.findByRepoFullName("example/taskboard")).thenReturn(Optional.empty());
        when(projects.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Project project = sync.sync("example/taskboard", null);

        assertThat(project.getManifest()).contains("\"kind\":\"video\"");
    }

    @Test
    void skipsWriteWhenBlobShaUnchanged() {
        Project stored = new Project("example/taskboard", "taskboard", "{}", "blob1");
        when(github.fetchManifest("example/taskboard", "abc123"))
                .thenReturn(new GitHubClient.TextFile(Fixtures.read("manifest-valid.json"), "blob1"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", "abc123"))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 1 }, "image/png"));
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
    void coerceKindMapsContentTypeToKind() {
        assertThat(ProjectSyncService.coerceKind("image/gif")).isEqualTo("gif");
        assertThat(ProjectSyncService.coerceKind("video/webm")).isEqualTo("video");
        assertThat(ProjectSyncService.coerceKind("image/jpeg")).isEqualTo("image");
        assertThat(ProjectSyncService.coerceKind("application/octet-stream")).isEqualTo("image");
    }

    @Test
    void syncsManifestWithoutCover() throws Exception {
        ObjectMapper om = new ObjectMapper();
        var node = (com.fasterxml.jackson.databind.node.ObjectNode) om.readTree(Fixtures.read("manifest-valid.json"));
        node.remove("cover");
        String noCover = om.writeValueAsString(node);
        when(github.fetchManifest("example/plain", null))
                .thenReturn(new GitHubClient.TextFile(noCover, "blob3"));
        when(projects.findByRepoFullName("example/plain")).thenReturn(Optional.empty());
        when(projects.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Project project = sync.sync("example/plain", null);

        assertThat(project.getManifest()).doesNotContain("\"data\"");
        verify(github, never()).fetchCover(any(), any(), any());
    }

    @Test
    void failsWhenCoverAssetMissing() {
        when(github.fetchManifest("example/taskboard", null))
                .thenReturn(new GitHubClient.TextFile(Fixtures.read("manifest-valid.json"), "blob4"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", null))
                .thenThrow(new GitHubFileNotFoundException("example/taskboard", "docs/cover.png"));

        assertThatThrownBy(() -> sync.sync("example/taskboard", null))
                .isInstanceOf(GitHubFileNotFoundException.class);
        verify(projects, never()).save(any());
    }

    @Test
    void refreshesExistingProjectWhenSlugChanges() {
        Project stored = new Project("example/taskboard", "old-slug", "{}", "old-blob");
        when(github.fetchManifest("example/taskboard", null))
                .thenReturn(new GitHubClient.TextFile(Fixtures.read("manifest-valid.json"), "new-blob"));
        when(github.fetchCover("example/taskboard", "docs/cover.png", null))
                .thenReturn(new GitHubClient.BinaryFile(new byte[] { 1 }, "image/png"));
        when(projects.findByRepoFullName("example/taskboard")).thenReturn(Optional.of(stored));

        Project result = sync.sync("example/taskboard", null);

        assertThat(result.getSlug()).isEqualTo("taskboard");
        assertThat(result.getSyncedSha()).contains("new-blob");
        verify(projects, never()).save(any());
    }

    @Test
    void propagatesGitHubClientExceptionWithoutWriting() {
        when(github.fetchManifest("example/boom", null))
                .thenThrow(new GitHubClientException(429, "rate limited"));

        assertThatThrownBy(() -> sync.sync("example/boom", null))
                .isInstanceOf(GitHubClientException.class);
        verify(projects, never()).save(any());
    }
}
