package com.abdelaziz.portfolio.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS for local Vite dev servers (any localhost port — Vite
 * auto-increments when 5173 is taken) and deployed frontend origins.
 * Configure via {@code app.cors.allowed-origins} (comma-separated
 * patterns, e.g. {@code http://localhost:* }).
 */
@Configuration
public class CorsConfig {

    @Bean
    WebMvcConfigurer corsConfigurer(
            @Value("${app.cors.allowed-origins:http://localhost:*}") String allowedOrigins) {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOriginPatterns(
                                java.util.Arrays.stream(allowedOrigins.split(","))
                                        .map(String::trim)
                                        .filter(s -> !s.isEmpty())
                                        .toArray(String[]::new))
                        .allowedMethods("GET", "POST", "OPTIONS")
                        .allowedHeaders("*")
                        .exposedHeaders("ETag")
                        .maxAge(3600);
            }
        };
    }
}
