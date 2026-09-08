package com.abdelaziz.portfolio.projects;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

class ProjectMapperTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void exposesCoverUrlAndStripsBytes() {
        String stored = """
                {"slug":"taskboard","featured":true,"displayOrder":2,
                 "cover":{"path":"docs/cover.png","alt":{"en":"Board"},"kind":"image",
                          "data":"AQID","contentType":"image/png"}}""";

        ObjectNode dto = ProjectMapper.toDto(mapper, "taskboard", stored);

        assertThat(dto.path("cover").path("url").asText())
                .isEqualTo("/api/projects/taskboard/cover");
        assertThat(dto.path("cover").path("kind").asText()).isEqualTo("image");
        assertThat(dto.path("cover").path("alt").path("en").asText()).isEqualTo("Board");
        assertThat(dto.path("cover").has("data")).isFalse();
        assertThat(dto.path("cover").has("path")).isFalse();
        assertThat(dto.toString()).doesNotContain("AQID");
        assertThat(dto.path("featured").asBoolean()).isTrue();
        assertThat(dto.path("displayOrder").asInt()).isEqualTo(2);
    }

    @Test
    void nullsCoverAndDefaultsFlagsWhenAbsent() {
        ObjectNode dto = ProjectMapper.toDto(mapper, "plain", "{\"slug\":\"plain\"}");

        assertThat(dto.path("cover").isNull()).isTrue();
        assertThat(dto.path("featured").asBoolean()).isFalse();
        assertThat(dto.path("displayOrder").asInt()).isZero();
    }
}
