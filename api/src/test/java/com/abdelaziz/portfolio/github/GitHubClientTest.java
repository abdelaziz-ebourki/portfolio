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
    void rejectsOversizedManifestBeforeDecoding() {
        next = StubResponse.file("x", "blobsha2", GitHubClient.MAX_MANIFEST_BYTES + 1);

        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("exceeds size cap");
    }

    @Test
    void fetchesCoverBytes() {
        next = StubResponse.file("PNGDATA", "blobsha3", 7);

        GitHubClient.BinaryFile cover = client.fetchCover("example/taskboard", "docs/cover.png", null);

        assertThat(new String(cover.bytes(), StandardCharsets.UTF_8)).isEqualTo("PNGDATA");
        assertThat(cover.contentType()).isEqualTo("image/png");
    }

    @Test
    void mapsAuthFailuresAndRateLimit() {
        for (int code : new int[] {401, 403}) {
            next = new StubResponse(code, "{\"message\":\"Bad credentials\"}");
            assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                    .isInstanceOf(GitHubClientException.class)
                    .satisfies(e -> assertThat(((GitHubClientException) e).status()).isEqualTo(code));
        }
        next = new StubResponse(429, "{\"message\":\"rate limited\"}");
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .satisfies(e -> assertThat(((GitHubClientException) e).status()).isEqualTo(429));
        next = new StubResponse(500, "{\"message\":\"boom\"}");
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .satisfies(e -> assertThat(((GitHubClientException) e).status()).isEqualTo(500));
    }

    @Test
    void rejectsNonFileTypeAndBadEncoding() {
        String encoded = Base64.getMimeEncoder().encodeToString("x".getBytes(StandardCharsets.UTF_8));
        next = new StubResponse(200,
                "{\"type\":\"dir\",\"encoding\":\"base64\",\"size\":1,\"sha\":\"abc\",\"content\":\"%s\"}".formatted(encoded));
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("Not a file");

        next = new StubResponse(200,
                "{\"type\":\"file\",\"encoding\":\"utf-8\",\"size\":1,\"sha\":\"abc\",\"content\":\"%s\"}".formatted(encoded));
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("Unexpected encoding");
    }

    @Test
    void rejectsBadJsonFromGitHub() {
        next = new StubResponse(200, "not json");
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("bad JSON");
    }

    @Test
    void mapsSlowGitHubToTimeout() {
        HttpServer slow = null;
        try {
            slow = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            slow.createContext("/", exchange -> {
                try {
                    Thread.sleep(1500);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
                }
                byte[] body = "{}".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(200, body.length);
                try (OutputStream out = exchange.getResponseBody()) {
                    out.write(body);
                }
            });
            slow.start();
            GitHubClient impatient = new GitHubClient(
                    new ObjectMapper(),
                    "http://127.0.0.1:" + slow.getAddress().getPort(),
                    "test-token",
                    java.time.Duration.ofMillis(200));

            assertThatThrownBy(() -> impatient.fetchManifest("example/taskboard", null))
                    .isInstanceOf(GitHubClientException.class)
                    .satisfies(e -> assertThat(((GitHubClientException) e).status()).isEqualTo(504));
        } catch (IOException e) {
            throw new AssertionError(e);
        } finally {
            if (slow != null) {
                slow.stop(0);
            }
        }
    }

    @Test
    void rejectsBadBase64FromGitHub() {
        next = new StubResponse(200,
                "{\"type\":\"file\",\"encoding\":\"base64\",\"size\":4,\"sha\":\"abc\",\"content\":\"!!!not-base64!!!\"}");
        assertThatThrownBy(() -> client.fetchManifest("example/taskboard", null))
                .isInstanceOf(GitHubClientException.class)
                .hasMessageContaining("bad base64");
    }

    @Test
    void encodesRepoSegmentsInUrl() {
        AtomicReference<String> lastPath = new AtomicReference<>();
        HttpServer probe = null;
        try {
            probe = HttpServer.create(new InetSocketAddress("127.0.0.1", 0), 0);
            probe.createContext("/", exchange -> {
                lastPath.set(exchange.getRequestURI().getRawPath());
                byte[] body = "{\"message\":\"Not Found\"}".getBytes(StandardCharsets.UTF_8);
                exchange.sendResponseHeaders(404, body.length);
                try (OutputStream out = exchange.getResponseBody()) {
                    out.write(body);
                }
            });
            probe.start();
            GitHubClient probeClient = new GitHubClient(
                    new ObjectMapper(), "http://127.0.0.1:" + probe.getAddress().getPort(), "test-token");

            assertThatThrownBy(() -> probeClient.fetchManifest("exam ple/task board", null))
                    .isInstanceOf(GitHubFileNotFoundException.class);
            assertThat(lastPath.get()).isEqualTo("/repos/exam%20ple/task%20board/contents/.portfolio.json");
        } catch (IOException e) {
            throw new AssertionError(e);
        } finally {
            if (probe != null) {
                probe.stop(0);
            }
        }
    }
}
