package com.abdelaziz.portfolio.contact;

import java.time.Duration;
import java.time.Instant;
import java.util.ArrayDeque;
import java.util.Deque;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

/**
 * Fixed-window per-IP throttle for the contact endpoint. In-memory:
 * counters reset on restart, which is acceptable at portfolio volume.
 */
@Component
public class ContactThrottle {

    private final int maxPerWindow;
    private final Duration window;
    private final ConcurrentHashMap<String, Deque<Instant>> hits = new ConcurrentHashMap<>();

    public ContactThrottle(
            @Value("${app.contact.max-per-hour:5}") int maxPerWindow,
            @Value("${app.contact.window:PT1H}") Duration window) {
        this.maxPerWindow = maxPerWindow;
        this.window = window;
    }

    /** @return true when the sender may proceed (and records the hit). */
    public boolean tryAcquire(String ip) {
        String key = ip == null ? "unknown" : ip;
        Instant now = Instant.now();
        Instant cutoff = now.minus(window);
        Deque<Instant> deque = hits.computeIfAbsent(key, k -> new ArrayDeque<>());
        synchronized (deque) {
            while (!deque.isEmpty() && deque.peekFirst().isBefore(cutoff)) {
                deque.removeFirst();
            }
            if (deque.size() >= maxPerWindow) {
                return false;
            }
            deque.addLast(now);
            return true;
        }
    }
}
