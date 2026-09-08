package com.abdelaziz.portfolio.webhook;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.nio.charset.StandardCharsets;

import org.junit.jupiter.api.Test;

class WebhookVerifierTest {

    private static final byte[] BODY = "{\"zen\":\"keep it simple\"}".getBytes(StandardCharsets.UTF_8);

    private final WebhookVerifier verifier = new WebhookVerifier("s3cr3t");

    @Test
    void acceptsSignatureItProduced() {
        assertThat(verifier.valid(verifier.sign(BODY), BODY)).isTrue();
    }

    @Test
    void rejectsTamperedBodyWrongSecretAndMalformedHeaders() {
        String good = verifier.sign(BODY);
        byte[] tampered = "{\"zen\":\"tampered\"}".getBytes(StandardCharsets.UTF_8);

        assertThat(verifier.valid(good, tampered)).isFalse();
        assertThat(new WebhookVerifier("other").valid(good, BODY)).isFalse();
        assertThat(verifier.valid("sha256=zz", BODY)).isFalse();
        assertThat(verifier.valid("md5=abcdef", BODY)).isFalse();
        assertThat(verifier.valid(null, BODY)).isFalse();
    }

    @Test
    void failClosedWithoutSecret() {
        WebhookVerifier unconfigured = new WebhookVerifier("");
        assertThat(unconfigured.valid(verifier.sign(BODY), BODY)).isFalse();
        assertThatThrownBy(() -> unconfigured.sign(BODY)).isInstanceOf(IllegalStateException.class);
    }
}
