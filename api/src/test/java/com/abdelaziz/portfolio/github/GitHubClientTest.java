package com.abdelaziz.portfolio.github;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.util.Base64;
import java.util.concurrent.atomic.AtomicReference;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sun.net.httpserver.HttpServer;

/** GitHubClient against a stubbed Contents API (JDK HttpServer, no new deps). */
class GitHubClientTest {

    private HttpServer stub;
    private GitHubClient client;
    private final AtomicReference<String> lastAuth = new AtomicReference<>();
    private volatile StubResponse next = StubResponse.notFound();

    record StubResponse(int status, String body) {
        static StubResponse notFound() {
            return new StubResponse(404, "{\"message\":\"Not Found\"}");
        }

        static StubResponse file(String content, String sha, long size) {
            String encoded = Base64.getMimeEncoder().encodeToString(content.getBytes(StandardCharsets.UTF_8));
            return new StubResponse(200, """
                    {"type":"file","encoding":"base64","size":%d,"sha":"%s","content":"%s"}"""
                    .formatted(size, sha, encoded));
        }
    }

    @BeforeEach
    void startStub() throws IOException {
        stub = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
        stub.createContext("/", exchange -> {
            lastAuth.set(exchange.getRequestHeaders().getFirst("Authorization"));
            byte[] body = next.body().getBytes(StandardCharsets.UTF_8);
            exchange.getResponseHeaders().add("Content-Type", "application/json");
            exchange.sendResponseHeaders(next.status(), body.length);
            try (OutputStream out = exchange.getResponseBody()) {
                out.write(body);
            }
        });
        stub.start();
        client = new GitHubClient(
                new ObjectMapper(), "http://127.0.0.1:" + stub.getAddress().getPort(), "test-token");
    }

    @AfterEach
    void stopStub() {
        stub.stop(0);
    }

    @Test
    void fetchesManifestWithBearerToken() {
        next = StubResponse.file("{\"slug\":\"taskboard\"}", "blobsha1", 21);

        GitHubClient.TextFile file = client.fetchManifest("example/taskboard", "main");

        assertThat(file.content()).isEqualTo("{\"slug\":\"taskboard\"}");
        assertThat(file.sha()).isEqualTo("blobsha1");
        assertThat(lastAuth.get()).isEqualTo("Bearer test-token");
    }

    @Test
    void mapsMissingManifestToNotFound() {
        next = StubResponse.notFound();

        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubFileNotFoundException.class)
                .hasMessageContaining(".portfolio.json");
    }

    @Test
    void rejectsOversizedCoverBeforeDecoding() {
        next = StubResponse.file("x", "blobsha2", GitHubClient.MAX_COVER_BYTES + 1);

        assertThatThrownBy(() -> client.fetchCover("example/taskboard", "docs/huge.mp4", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("exceeds size cap");
    }

    @Test
    void fetchesCoverBytes() {
        next = StubResponse.file("PNGDATA", "blobsha3", 7);

        GitHubClient.BinaryFile cover = client.fetchCover("example/taskboard", "docs/cover.png", null);

        assertThat(new String(cover.bytes(), StandardCharsets.UTF_8)).isEqualTo("PNGDATA");
        assertThat(cover.contentType()).isEqualTo("image/png");
        // BinaryFile no longer carries the blob sha — deduped with TextFile's.
    }
}
