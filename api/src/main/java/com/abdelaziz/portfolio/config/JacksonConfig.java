package com.abdelaziz.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Boot 4 auto-configures Jackson 3 ({@code tools.jackson}); the manifest
 * pipeline (networknt validator, webhook parsing) runs on Jackson 2, so the
 * shared {@code com.fasterxml.jackson} mapper is declared explicitly.
 */
@Configuration
public class JacksonConfig {

    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}
