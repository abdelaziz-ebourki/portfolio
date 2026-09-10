package com.abdelaziz.portfolio.contact;

import java.time.Instant;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.abdelaziz.portfolio.config.AdminAuth;

/** Owner inbox read: {@code GET /api/admin/messages} (latest 50). */
@RestController
@RequestMapping("/admin/messages")
public class ContactAdminController {

    private final ContactMessageRepository messages;
    private final AdminAuth admin;

    public ContactAdminController(ContactMessageRepository messages, AdminAuth admin) {
        this.messages = messages;
        this.admin = admin;
    }

    public record MessageDto(
            UUID id, String name, String email, String message,
            Instant createdAt, boolean read) {
    }

    @GetMapping(produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> list(
            @RequestHeader(value = "Authorization", required = false) String authorization) {
        if (!admin.configured()) {
            return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                    .body(Map.of("error", "admin messages are not configured"));
        }
        if (!admin.valid(authorization)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "invalid admin token"));
        }
        List<MessageDto> out = messages.findTop50ByOrderByCreatedAtDesc().stream()
                .map(m -> new MessageDto(
                        m.getId(), m.getName(), m.getEmail(), m.getMessage(),
                        m.getCreatedAt(), m.isRead()))
                .toList();
        return ResponseEntity.ok(out);
    }
}
