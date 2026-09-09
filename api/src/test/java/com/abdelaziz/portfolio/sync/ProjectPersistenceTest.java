package com.abdelaziz.portfolio.sync;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.abdelaziz.portfolio.config.JacksonConfig;
import com.fasterxml.jackson.databind.ObjectMapper;

/** Real Postgres round-trip for the projects table (JSONB + CHAR(40)). */
@Testcontainers
@DataJpaTest
@Import(JacksonConfig.class)
class ProjectPersistenceTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
        r.add("spring.flyway.enabled", () -> "true");
        r.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired
    private ProjectRepository projects;

    @Autowired
    private ObjectMapper mapper;

    @Test
    void persistsCoverEnrichedManifestAndUpdatesSlug() throws Exception {
        String manifest = """
                {"slug":"taskboard","name":{"en":"Taskboard"},"tagline":{"en":"t"},"status":"shipped",
                 "role":"solo","kind":"personal","period":{"start":"2024-02"},"stack":["Java"],
                 "repos":[{"label":"repo","url":"https://example.com"}],"links":{},"highlights":{"en":["h"]},
                 "cover":{"path":"docs/cover.png","alt":{"en":"Board"},"kind":"image","data":"AQID","contentType":"image/png"}}""";
        Project saved = projects.save(new Project("example/taskboard", "taskboard", manifest, "a".repeat(40)));
        projects.flush();

        Project loaded = projects.findBySlug("taskboard").orElseThrow();
        assertThat(loaded.getSlug()).isEqualTo("taskboard");
        assertThat(mapper.readTree(loaded.getManifest()).path("cover").path("data").asText())
                .isEqualTo("AQID");
        assertThat(loaded.getSyncedSha()).contains("a".repeat(40));
        assertThat(projects.findByRepoFullName("example/taskboard")).isPresent();

        loaded.refresh("board", manifest.replace("taskboard", "board"), "b".repeat(40));
        projects.flush();

        assertThat(projects.findBySlug("board")).isPresent();
        assertThat(projects.findBySlug("taskboard")).isEmpty();
        assertThat(saved.getSlug()).isEqualTo("board");
    }

    @Test
    void enforcesUniqueRepoFullName() {
        projects.save(new Project("example/a", "a", "{}", "a".repeat(40)));
        projects.flush();

        projects.save(new Project("example/a", "b", "{}", "b".repeat(40)));
        assertThatThrownBy(() -> projects.flush()).isInstanceOf(DataIntegrityViolationException.class);
    }

    @Test
    void enforcesUniqueSlug() {
        projects.save(new Project("example/a", "a", "{}", "a".repeat(40)));
        projects.flush();

        projects.save(new Project("example/b", "a", "{}", "b".repeat(40)));
        assertThatThrownBy(() -> projects.flush()).isInstanceOf(DataIntegrityViolationException.class);
    }
}
