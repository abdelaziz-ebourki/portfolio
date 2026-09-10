package com.abdelaziz.portfolio.contact;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * Inbound contact payload. {@code company} is the honeypot — real users
 * never see it, bots fill it in.
 */
public record ContactRequest(
        @NotBlank @Size(max = 100) String name,
        @NotBlank @Email @Size(max = 254) String email,
        @NotBlank @Size(max = 2000) String message,
        @Size(max = 100) String company) {
}
