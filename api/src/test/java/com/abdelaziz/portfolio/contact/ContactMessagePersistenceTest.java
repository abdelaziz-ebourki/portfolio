package com.abdelaziz.portfolio.contact;

import static org.assertj.core.api.Assertions.assertThat;

import java.util.List;

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

/** Real Postgres round-trip for contact_messages (defaults + ordering). */
@Testcontainers
@DataJpaTest
@Import(JacksonConfig.class)
class ContactMessagePersistenceTest {

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
    private ContactMessageRepository messages;

    @Test
    void persistsWithDefaultsAndListsNewestFirst() throws InterruptedException {
        messages.save(new ContactMessage("First", "first@example.com", "Hello", "127.0.0.1"));
        Thread.sleep(10);
        messages.save(new ContactMessage("Second", "second@example.com", "Hi", "127.0.0.2"));
        messages.flush();

        List<ContactMessage> latest = messages.findTop50ByOrderByCreatedAtDesc();
        assertThat(latest).hasSize(2);
        assertThat(latest.get(0).getName()).isEqualTo("Second");
        assertThat(latest.get(0).isRead()).isFalse();
        assertThat(latest.get(0).getId()).isNotNull();
        assertThat(latest.get(0).getCreatedAt()).isNotNull();
    }
}
