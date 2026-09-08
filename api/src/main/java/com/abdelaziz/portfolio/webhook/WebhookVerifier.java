package com.abdelaziz.portfolio.webhook;

import java.nio.charset.StandardCharsets;
import java.security.InvalidKeyException;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Verifies GitHub webhook HMAC signatures ({@code X-Hub-Signature-256}).
 * Fail-closed: with no secret configured every delivery is rejected.
 */
@Component
public class WebhookVerifier {

    private static final String PREFIX = "sha256=";

    private final String secret;

    public WebhookVerifier(@Value("${github.webhook-secret:}") String secret) {
        this.secret = secret == null ? "" : secret;
    }

    public boolean valid(String signatureHeader, byte[] body) {
        if (secret.isBlank() || signatureHeader == null || !signatureHeader.startsWith(PREFIX)) {
            return false;
        }
        byte[] expected = hmac(body);
        byte[] actual = hexToBytes(signatureHeader.substring(PREFIX.length()));
        return actual != null && MessageDigest.isEqual(expected, actual);
    }

    /** Computes the expected header value (used by tests and smoke scripts). */
    public String sign(byte[] body) {
        if (secret.isBlank()) {
            throw new IllegalStateException("Cannot sign: no webhook secret configured");
        }
        StringBuilder hex = new StringBuilder(PREFIX);
        for (byte b : hmac(body)) {
            hex.append(String.format("%02x", b));
        }
        return hex.toString();
    }

    private byte[] hmac(byte[] body) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(secret.getBytes(StandardCharsets.UTF_8), "HmacSHA256"));
            return mac.doFinal(body);
        } catch (NoSuchAlgorithmException | InvalidKeyException e) {
            throw new IllegalStateException("HmacSHA256 unavailable", e);
        }
    }

    private static byte[] hexToBytes(String hex) {
        if (hex.length() % 2 != 0) {
            return null;
        }
        byte[] out = new byte[hex.length() / 2];
        for (int i = 0; i < out.length; i++) {
            int hi = Character.digit(hex.charAt(2 * i), 16);
            int lo = Character.digit(hex.charAt(2 * i + 1), 16);
            if (hi < 0 || lo < 0) {
                return null;
            }
            out[i] = (byte) ((hi << 4) + lo);
        }
        return out;
    }
}
