package com.abdelaziz.portfolio.projects;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.when;

import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.abdelaziz.portfolio.sync.Project;
import com.abdelaziz.portfolio.sync.ProjectRepository;
import com.fasterxml.jackson.databind.ObjectMapper;

@ExtendWith(MockitoExtension.class)
class ProjectCatalogTest {

    @Mock
    private ProjectRepository projects;

    private ProjectCatalog catalog;

    @org.junit.jupiter.api.BeforeEach
    void wireCatalog() {
        catalog = new ProjectCatalog(projects, new ObjectMapper());
    }

    @Test
    void listsOrderedByDisplayOrder() {
        when(projects.findAll()).thenReturn(List.of(
                new Project("example/b", "b", "{\"slug\":\"b\",\"displayOrder\":5}", null),
                new Project("example/a", "a", "{\"slug\":\"a\"}", null)));

        var slugs = catalog.list().stream().map(dto -> dto.get("slug")).toList();

        assertThat(slugs).containsExactly("a", "b");
    }

    @Test
    void resolvesCoverBytesAndMisses() {
        when(projects.findBySlug("taskboard")).thenReturn(Optional.of(new Project(
                "example/taskboard", "taskboard",
                "{\"slug\":\"taskboard\",\"cover\":{\"kind\":\"image\",\"data\":\"AQID\",\"contentType\":\"image/png\"}}",
                "blob1")));
        when(projects.findBySlug("plain"))
                .thenReturn(Optional.of(new Project("example/plain", "plain", "{\"slug\":\"plain\"}", null)));
        when(projects.findBySlug("ghost")).thenReturn(Optional.empty());

        assertThat(catalog.cover("taskboard"))
                .hasValueSatisfying(asset -> {
                    assertThat(asset.bytes()).containsExactly(1, 2, 3);
                    assertThat(asset.contentType()).isEqualTo("image/png");
                });
        assertThat(catalog.cover("plain")).isEmpty();
        assertThat(catalog.cover("ghost")).isEmpty();
    }
}
