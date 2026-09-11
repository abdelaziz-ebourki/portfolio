package com.abdelaziz.portfolio.webhook;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.config.JacksonConfig;
import com.abdelaziz.portfolio.sync.ProjectSyncService;

@WebMvcTest(WebhookController.class)
@Import(JacksonConfig.class)
class WebhookControllerTest {

    private static final String SIGNATURE = "sha256=abc123";

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private WebhookVerifier verifier;

    @MockitoBean
    private WebhookDeliveryRepository deliveries;

    @MockitoBean
    private ProjectSyncService sync;

    @Test
    void rejectsInvalidSignatureWithoutTouchingTheLog() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(false);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "push")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pushTouchingManifest()))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.error").value("invalid signature"));

        verify(deliveries, never()).save(any());
    }

    @Test
    void answersPing() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "ping")
                        .header("X-GitHub-Delivery", "delivery-ping-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("pong"));

        verify(deliveries).save(any(WebhookDelivery.class));
    }

    @Test
    void acceptsPushTouchingTheManifest() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);
        when(deliveries.existsById("delivery-push-1")).thenReturn(false);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "push")
                        .header("X-GitHub-Delivery", "delivery-push-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pushTouchingManifest()))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("accepted"));
    }

    @Test
    void ignoresPushTouchingOnlySourceFiles() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);
        when(deliveries.existsById("delivery-push-2")).thenReturn(false);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "push")
                        .header("X-GitHub-Delivery", "delivery-push-2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pushTouchingOnlySources()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ignored"));
    }

    @Test
    void dropsRetriedDeliveryAsDuplicate() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);
        when(deliveries.existsById("delivery-push-1")).thenReturn(true);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "push")
                        .header("X-GitHub-Delivery", "delivery-push-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(pushTouchingManifest()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("duplicate"));

        verify(deliveries, never()).save(any());
    }

    @Test
    void dropsRetriedPingAsDuplicate() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);
        when(deliveries.existsById("delivery-ping-1")).thenReturn(true);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "ping")
                        .header("X-GitHub-Delivery", "delivery-ping-1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("duplicate"));

        verify(deliveries, never()).save(any());
    }

    @Test
    void ignoresPushWithoutRepository() throws Exception {
        when(verifier.valid(any(), any())).thenReturn(true);
        when(deliveries.existsById("delivery-push-3")).thenReturn(false);

        mvc.perform(post("/webhooks/github")
                        .header("X-Hub-Signature-256", SIGNATURE)
                        .header("X-GitHub-Event", "push")
                        .header("X-GitHub-Delivery", "delivery-push-3")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"after": "abc", "commits": [{"added": [".portfolio.json"], "modified": [], "removed": []}]}"""))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("ignored"));

        verify(sync, never()).sync(any(), any());
    }

    private static byte[] pushTouchingManifest() {
        return pushJson("""
                {"added": [".portfolio.json"], "modified": ["src/Main.java"], "removed": []}""");
    }

    private static byte[] pushTouchingOnlySources() {
        return pushJson("""
                {"added": [], "modified": ["src/Main.java", "README.md"], "removed": []}""");
    }

    private static byte[] pushJson(String commitFiles) {
        String json = """
                {
                  "after": "d34db33fd34db33fd34db33fd34db33fd34db33f",
                  "repository": {"full_name": "example/taskboard"},
                  "commits": [%s]
                }""".formatted(commitFiles);
        return json.getBytes(StandardCharsets.UTF_8);
    }
}
