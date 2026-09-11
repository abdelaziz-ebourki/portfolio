package com.abdelaziz.portfolio.contact;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Public inbox: {@code POST /api/contact}. Valid messages are stored;
 * honeypot fills are silently accepted without storing (no probing
 * signal); over-limit senders get 429.
 *
 * <p>The honeypot is checked on the raw payload <em>before</em> bean
 * validation runs, so a bot filling {@code company} always sees the same
 * 202 regardless of what else it sends — validation errors must never
 * leak the honeypot's presence.
 */
@RestController
@RequestMapping("/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactMessageRepository messages;
    private final ContactThrottle throttle;
    private final ObjectMapper mapper;
    private final Validator validator;

    public ContactController(ContactMessageRepository messages, ContactThrottle throttle,
            ObjectMapper mapper, Validator validator) {
        this.messages = messages;
        this.throttle = throttle;
        this.mapper = mapper;
        this.validator = validator;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, Object>> submit(
            @RequestBody byte[] body, HttpServletRequest http) {
        final JsonNode raw;
        try {
            raw = mapper.readTree(body);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "payload is not JSON"));
        }
        if (!raw.path("company").asText("").isBlank()) {
            log.debug("Dropping honeypot contact submission");
            return received();
        }
        final ContactRequest request;
        try {
            request = mapper.treeToValue(raw, ContactRequest.class);
        } catch (JsonProcessingException | IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "payload is not a contact message"));
        }
        Set<ConstraintViolation<ContactRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            Map<String, String> fields = new LinkedHashMap<>();
            violations.forEach(v -> fields.putIfAbsent(
                    v.getPropertyPath().toString(), v.getMessage()));
            Map<String, Object> errorBody = new LinkedHashMap<>();
            errorBody.put("error", "validation failed");
            errorBody.put("fields", fields);
            return ResponseEntity.status(HttpStatus.UNPROCESSABLE_ENTITY).body(errorBody);
        }
        String ip = http.getRemoteAddr();
        if (!throttle.tryAcquire(ip)) {
            Map<String, Object> errorBody = new LinkedHashMap<>();
            errorBody.put("error", "too many messages, try again later");
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", "3600")
                    .body(errorBody);
        }
        messages.save(new ContactMessage(
                request.name().strip(), request.email().strip(), request.message().strip(), ip));
        return received();
    }

    private static ResponseEntity<Map<String, Object>> received() {
        Map<String, Object> ok = new LinkedHashMap<>();
        ok.put("status", "received");
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(ok);
    }
}
