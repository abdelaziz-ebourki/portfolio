package com.abdelaziz.portfolio.config;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/** Shared bearer check for admin endpoints. Fail-closed when unconfigured. */
@Component
public class AdminAuth {

    private final String adminToken;

    public AdminAuth(@Value("${admin.token:}") String adminToken) {
        this.adminToken = adminToken == null ? "" : adminToken;
    }

    public boolean configured() {
        return !adminToken.isBlank();
    }

    public boolean valid(String authorizationHeader) {
        if (adminToken.isBlank()) {
            return false;
        }
        byte[] expected = ("Bearer " + adminToken).getBytes(StandardCharsets.UTF_8);
        byte[] actual = authorizationHeader == null
                ? new byte[0]
                : authorizationHeader.getBytes(StandardCharsets.UTF_8);
        return MessageDigest.isEqual(expected, actual);
    }
}
