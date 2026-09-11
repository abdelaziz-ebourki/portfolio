package com.abdelaziz.portfolio.github;

import java.io.IOException;
import java.net.URI;
import java.net.URLEncoder;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.net.http.HttpTimeoutException;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.Arrays;
import java.util.Base64;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Minimal GitHub Contents API client (JDK {@code HttpClient}, no extra deps).
 * Reads {@code .portfolio.json} and cover assets with a fine-grained PAT
 * ({@code Contents:read}). Failures surface as typed exceptions so callers
 * can map them to status codes.
 */
@Component
public class GitHubClient {

    static final long MAX_MANIFEST_BYTES = 1024 * 1024;
    static final long MAX_COVER_BYTES = 10L * 1024 * 1024;

    private static final String MANIFEST_PATH = ".portfolio.json";

    private final HttpClient http = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(5))
            .build();
    private final Duration requestTimeout;
    private final ObjectMapper mapper;
    private final String baseUrl;
    private final String token;

    @Autowired
    public GitHubClient(
            ObjectMapper mapper,
            @Value("${github.api-base-url:https://api.github.com}") String baseUrl,
            @Value("${github.token:}") String token) {
        this(mapper, baseUrl, token, Duration.ofSeconds(10));
    }

    GitHubClient(ObjectMapper mapper, String baseUrl, String token, Duration requestTimeout) {
        this.mapper = mapper;
        this.baseUrl = baseUrl.endsWith("/") ? baseUrl.substring(0, baseUrl.length() - 1) : baseUrl;
        this.token = token == null ? "" : token;
        this.requestTimeout = requestTimeout;
    }

    public record TextFile(String content, String sha) {
    }

    public record BinaryFile(byte[] bytes, String contentType) {
    }

    public TextFile fetchManifest(String repo, String ref) {
        JsonNode meta = getJson(contentsUrl(repo, MANIFEST_PATH, ref), repo, MANIFEST_PATH);
        String content = decode(meta, repo, MANIFEST_PATH, MAX_MANIFEST_BYTES);
        return new TextFile(content, meta.path("sha").asText(null));
    }

    public BinaryFile fetchCover(String repo, String path, String ref) {
        JsonNode meta = getJson(contentsUrl(repo, path, ref), repo, path);
        byte[] bytes = decodeBytes(meta, repo, path, MAX_COVER_BYTES);
        return new BinaryFile(bytes, guessContentType(path));
    }

    private JsonNode getJson(String url, String repo, String path) {
        HttpRequest.Builder request = HttpRequest.newBuilder(URI.create(url))
                .header("Accept", "application/vnd.github+json")
                .header("X-GitHub-Api-Version", "2022-11-28")
                .timeout(requestTimeout)
                .GET();
        if (!token.isBlank()) {
            request.header("Authorization", "Bearer " + token);
        }
        final HttpResponse<String> response;
        try {
            response = http.send(request.build(), HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new GitHubClientException(502, "GitHub request interrupted for " + repo);
        } catch (HttpTimeoutException e) {
            throw new GitHubClientException(504, "GitHub request timed out for " + repo);
        } catch (IOException e) {
            throw new GitHubClientException(502, "GitHub request failed for " + repo + ": " + e.getMessage());
        }
        return switch (response.statusCode()) {
            case 200 -> parse(response.body(), repo);
            case 401, 403 -> throw new GitHubClientException(response.statusCode(),
                    "GitHub auth failed (check GITHUB_TOKEN scopes): " + response.body());
            case 404 -> throw new GitHubFileNotFoundException(repo, path);
            case 429 -> throw new GitHubClientException(429,
                    "GitHub rate limit hit: " + response.body());
            default -> throw new GitHubClientException(response.statusCode(),
                    "GitHub request failed (" + response.statusCode() + "): " + response.body());
        };
    }

    private JsonNode parse(String body, String repo) {
        try {
            return mapper.readTree(body);
        } catch (IOException e) {
            throw new GitHubClientException(502, "GitHub returned bad JSON for " + repo);
        }
    }

    private static String decode(JsonNode meta, String repo, String path, long cap) {
        return new String(decodeBytes(meta, repo, path, cap), StandardCharsets.UTF_8);
    }

    private static byte[] decodeBytes(JsonNode meta, String repo, String path, long cap) {
        if (!"file".equals(meta.path("type").asText())) {
            throw new GitHubClientException(422, "Not a file in repo " + repo + ": " + path);
        }
        if (!"base64".equals(meta.path("encoding").asText())) {
            throw new GitHubClientException(502, "Unexpected encoding for " + path + " in repo " + repo);
        }
        long size = meta.path("size").asLong(-1);
        if (size > cap) {
            throw new GitHubClientException(413,
                    path + " in repo " + repo + " exceeds size cap (" + size + " bytes)");
        }
        final byte[] bytes;
        try {
            bytes = Base64.getMimeDecoder().decode(meta.path("content").asText(""));
        } catch (IllegalArgumentException e) {
            throw new GitHubClientException(502, "GitHub returned bad base64 for " + path + " in repo " + repo);
        }
        if (bytes.length > cap) {
            throw new GitHubClientException(413,
                    path + " in repo " + repo + " exceeds size cap (" + bytes.length + " bytes)");
        }
        return bytes;
    }

    private String contentsUrl(String repo, String path, String ref) {
        String encoded = encodeSegments(path);
        String url = baseUrl + "/repos/" + encodeSegments(repo) + "/contents/" + encoded;
        return ref != null ? url + "?ref=" + URLEncoder.encode(ref, StandardCharsets.UTF_8) : url;
    }

    private static String encodeSegments(String value) {
        return Arrays.stream(value.split("/", -1))
                .map(segment -> URLEncoder.encode(segment, StandardCharsets.UTF_8).replace("+", "%20"))
                .reduce((a, b) -> a + "/" + b)
                .orElse("");
    }

    private static String guessContentType(String path) {
        String lower = path.toLowerCase();
        if (lower.endsWith(".png")) {
            return "image/png";
        } else if (lower.endsWith(".gif")) {
            return "image/gif";
        } else if (lower.endsWith(".webp")) {
            return "image/webp";
        } else if (lower.endsWith(".avif")) {
            return "image/avif";
        } else if (lower.endsWith(".mp4")) {
            return "video/mp4";
        } else if (lower.endsWith(".webm")) {
            return "video/webm";
        } else if (lower.endsWith(".svg")) {
            return "image/svg+xml";
        }
        return "image/jpeg";
    }
}
