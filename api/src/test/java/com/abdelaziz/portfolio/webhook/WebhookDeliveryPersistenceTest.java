package com.abdelaziz.portfolio.webhook;

import static org.assertj.core.api.Assertions.assertThat;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.DynamicPropertyRegistry;
import org.springframework.test.context.DynamicPropertySource;
import org.testcontainers.containers.PostgreSQLContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import com.abdelaziz.portfolio.config.JacksonConfig;

@Testcontainers
@DataJpaTest
@Import(JacksonConfig.class)
class WebhookDeliveryPersistenceTest {

    @Container
    static PostgreSQLContainer<?> postgres = new PostgreSQLContainer<>("postgres:16-alpine");

    @DynamicPropertySource
    static void props(DynamicPropertyRegistry r) {
        r.add("spring.datasource.url", postgres::getJdbcUrl);
        r.add("spring.datasource.username", postgres::getUsername);
        r.add("spring.datasource.password", postgres::getPassword);
        r.add("spring.flyway.enabled", () -> "true");
        r.add("spring.jpa.hibernate.ddl-auto", () -> "validate");
    }

    @Autowired
    private WebhookDeliveryRepository deliveries;

    @Test
    void persistsAndGuardsDuplicateDeliveryId() {
        deliveries.save(new WebhookDelivery("delivery-1", "push", "example/taskboard", "accepted"));
        deliveries.flush();

        assertThat(deliveries.existsById("delivery-1")).isTrue();
        assertThat(deliveries.findById("delivery-1")).isPresent();
        assertThat(deliveries.existsById("other")).isFalse();
    }
}
