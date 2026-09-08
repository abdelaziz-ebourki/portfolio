package com.abdelaziz.portfolio.manifest;

import java.util.Set;

/** Thrown when a manifest is not JSON or violates the portfolio schema. */
public class InvalidManifestException extends RuntimeException {

    private final Set<String> violations;

    public InvalidManifestException(String message) {
        super(message);
        this.violations = Set.of();
    }

    public InvalidManifestException(String message, Set<String> violations) {
        super(message);
        this.violations = Set.copyOf(violations);
    }

    public Set<String> violations() {
        return violations;
    }
}
