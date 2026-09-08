package com.abdelaziz.portfolio.manifest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import java.io.IOException;
import java.io.UncheckedIOException;
import java.nio.charset.StandardCharsets;
import java.util.Set;

import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.databind.ObjectMapper;

class ManifestValidatorTest {

    private final ManifestValidator validator = new ManifestValidator(new ObjectMapper());

    @Test
    void acceptsFullyPopulatedManifest() {
        assertThat(validator.validate(fixture("manifest-valid.json"))).isEmpty();
        assertThat(validator.requireValid(fixture("manifest-valid.json")).get("slug").asText())
                .isEqualTo("taskboard");
    }

    @Test
    void rejectsMissingSlugBadEnumAndNonRepoRelativeCover() {
        Set<String> violations = validator.validate(fixture("manifest-invalid.json"));

        assertThat(violations).anySatisfy(v -> assertThat(v).contains("slug"));
        assertThat(violations).anySatisfy(v -> assertThat(v).contains("$.status"));
        assertThat(violations).anySatisfy(v -> assertThat(v).contains("cover.path"));
    }

    @Test
    void rejectsNonJsonPayload() {
        assertThatThrownBy(() -> validator.validate("{nope"))
                .isInstanceOf(InvalidManifestException.class)
                .hasMessageContaining("not valid JSON");
    }

    @Test
    void requireValidThrowsWithViolationsListed() {
        assertThatThrownBy(() -> validator.requireValid(fixture("manifest-invalid.json")))
                .isInstanceOf(InvalidManifestException.class)
                .hasMessageContaining("violates schema");
    }

    private static String fixture(String name) {
        try (var in = ManifestValidatorTest.class.getResourceAsStream("/fixtures/" + name)) {
            if (in == null) {
                throw new IllegalStateException("Missing fixture: " + name);
            }
            return new String(in.readAllBytes(), StandardCharsets.UTF_8);
        } catch (IOException e) {
            throw new UncheckedIOException(e);
        }
    }
}
