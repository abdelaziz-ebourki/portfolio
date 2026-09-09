package com.abdelaziz.portfolio.webhook;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

class WebhookPushInspectorTest {

    private final ObjectMapper mapper = new ObjectMapper();

    @Test
    void detectsManifestAndCoverAssets() throws Exception {
        assertThat(touches("{\"commits\":[{\"added\":[\".portfolio.json\"],\"modified\":[],\"removed\":[]}]}"))
                .isTrue();
        assertThat(touches("{\"commits\":[{\"added\":[],\"modified\":[\"docs/cover.png\"],\"removed\":[]}]}"))
                .isTrue();
        assertThat(touches("{\"commits\":[{\"added\":[],\"modified\":[\"src/Main.java\"],\"removed\":[]}]}"))
                .isFalse();
        assertThat(touches("{\"commits\":[{\"added\":[],\"modified\":[\"README.md\"],\"removed\":[]}]}"))
                .isFalse();
        assertThat(touches("{\"commits\":[]}")).isFalse();
        assertThat(touches("{}")).isFalse();
    }

    @Test
    void removedManifestStillTriggers() throws Exception {
        assertThat(touches("{\"commits\":[{\"added\":[],\"modified\":[],\"removed\":[\".portfolio.json\"]}]}"))
                .isTrue();
    }

    @Test
    void extractsRepoAndHeadSha() throws Exception {
        var push = mapper.readTree(
                "{\"after\":\"abc123\",\"repository\":{\"full_name\":\"owner/repo\"},\"head_commit\":{\"id\":\"def456\"}}");
        assertThat(WebhookPushInspector.repoFullName(push)).isEqualTo("owner/repo");
        assertThat(WebhookPushInspector.headSha(push)).isEqualTo("abc123");

        var noAfter = mapper.readTree("{\"repository\":{\"full_name\":\"o/r\"},\"head_commit\":{\"id\":\"def456\"}}");
        assertThat(WebhookPushInspector.headSha(noAfter)).isEqualTo("def456");

        var empty = mapper.readTree("{}");
        assertThat(WebhookPushInspector.repoFullName(empty)).isNull();
        assertThat(WebhookPushInspector.headSha(empty)).isNull();
    }

    private boolean touches(String json) throws Exception {
        return WebhookPushInspector.touchesPortfolioFiles(mapper.readTree(json));
    }
}
