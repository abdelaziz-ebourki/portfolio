package com.abdelaziz.portfolio.manifest;

import java.io.IOException;
import java.io.InputStream;
import java.io.UncheckedIOException;
import java.util.Set;
import java.util.TreeSet;
import java.util.stream.Collectors;

import org.springframework.stereotype.Component;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.networknt.schema.JsonSchema;
import com.networknt.schema.JsonSchemaFactory;
import com.networknt.schema.SpecVersion;
import com.networknt.schema.ValidationMessage;

/**
 * Validates {@code .portfolio.json} manifests against the versioned JSON
 * Schema ({@code portfolio-manifest-schema.json}). The schema mirrors the UI
 * {@code ProjectDto} contract; invalid manifests are rejected before any
 * write, so a bad push can never corrupt stored project data.
 */
@Component
public class ManifestValidator {

    private static final String SCHEMA_CLASSPATH = "/portfolio-manifest-schema.json";

    private final JsonSchema schema;
    private final ObjectMapper mapper;

    public ManifestValidator(ObjectMapper mapper) {
        this.mapper = mapper;
        try (InputStream in = ManifestValidator.class.getResourceAsStream(SCHEMA_CLASSPATH)) {
            if (in == null) {
                throw new IllegalStateException("Manifest schema missing: " + SCHEMA_CLASSPATH);
            }
            this.schema = JsonSchemaFactory.getInstance(SpecVersion.VersionFlag.V202012)
                    .getSchema(in);
        } catch (IOException e) {
            throw new UncheckedIOException("Failed to load manifest schema", e);
        }
    }

    /**
     * @return sorted human-readable violations; empty when the manifest is valid.
     * @throws InvalidManifestException when the payload is not JSON at all.
     */
    public Set<String> validate(String manifestJson) {
        final JsonNode node;
        try {
            node = mapper.readTree(manifestJson);
        } catch (IOException e) {
            throw new InvalidManifestException("Manifest is not valid JSON: " + e.getMessage());
        }
        return schema.validate(node)
                .stream()
                .map(ValidationMessage::getMessage)
                .collect(Collectors.toCollection(TreeSet::new));
    }

    /** Returns the parsed manifest, or throws with the violations attached. */
    public JsonNode requireValid(String manifestJson) {
        Set<String> violations = validate(manifestJson);
        if (!violations.isEmpty()) {
            throw new InvalidManifestException("Manifest violates schema: " + String.join("; ", violations));
        }
        try {
            return mapper.readTree(manifestJson);
        } catch (IOException e) {
            throw new InvalidManifestException("Manifest is not valid JSON: " + e.getMessage());
        }
    }
}
