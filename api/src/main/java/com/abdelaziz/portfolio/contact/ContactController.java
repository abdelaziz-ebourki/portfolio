package com.abdelaziz.portfolio.contact;

import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Public inbox: {@code POST /api/contact}. Valid messages are stored;
 * honeypot fills are silently accepted without storing (no probing
 * signal); over-limit senders get 429.
 */
@RestController
@RequestMapping("/contact")
public class ContactController {

    private static final Logger log = LoggerFactory.getLogger(ContactController.class);

    private final ContactMessageRepository messages;
    private final ContactThrottle throttle;

    public ContactController(ContactMessageRepository messages, ContactThrottle throttle) {
        this.messages = messages;
        this.throttle = throttle;
    }

    @PostMapping(consumes = MediaType.APPLICATION_JSON_VALUE,
            produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Map<String, String>> submit(
            @Valid @RequestBody ContactRequest request, HttpServletRequest http) {
        if (request.company() != null && !request.company().isBlank()) {
            log.debug("Dropping honeypot contact submission");
            return received();
        }
        String ip = http.getRemoteAddr();
        if (!throttle.tryAcquire(ip)) {
            return ResponseEntity.status(HttpStatus.TOO_MANY_REQUESTS)
                    .header("Retry-After", "3600")
                    .body(Map.of("error", "too many messages, try again later"));
        }
        messages.save(new ContactMessage(
                request.name().strip(), request.email().strip(), request.message().strip(), ip));
        return received();
    }

    private static ResponseEntity<Map<String, String>> received() {
        return ResponseEntity.status(HttpStatus.ACCEPTED).body(Map.of("status", "received"));
    }
}
