package com.abdelaziz.portfolio.contact;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.config.JacksonConfig;

@WebMvcTest(ContactController.class)
@Import(JacksonConfig.class)
class ContactControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ContactMessageRepository messages;

    @MockitoBean
    private ContactThrottle throttle;

    private static String payload(String name, String email, String message) {
        return "{\"name\":\"%s\",\"email\":\"%s\",\"message\":\"%s\"}"
                .formatted(name, email, message);
    }

    @Test
    void storesValidMessage() throws Exception {
        when(throttle.tryAcquire(any())).thenReturn(true);

        mvc.perform(post("/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Jane", "jane@company.com", "Hello there")))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("received"));

        ArgumentCaptor<ContactMessage> saved = ArgumentCaptor.forClass(ContactMessage.class);
        verify(messages).save(saved.capture());
        assert saved.getValue().getName().equals("Jane");
        assert saved.getValue().getEmail().equals("jane@company.com");
    }

    @Test
    void honeypotPretendsSuccessWithoutStoring() throws Exception {
        mvc.perform(post("/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Bot\",\"email\":\"bot@spam.example\",\"message\":\"buy\",\"company\":\"SEO Inc\"}"))
                .andExpect(status().isAccepted())
                .andExpect(jsonPath("$.status").value("received"));

        verify(messages, never()).save(any());
        verify(throttle, never()).tryAcquire(any());
    }

    @Test
    void rejectsInvalidPayloadWithFieldErrors() throws Exception {
        when(throttle.tryAcquire(any())).thenReturn(true);

        mvc.perform(post("/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("", "not-an-email", "")))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("validation failed"))
                .andExpect(jsonPath("$.fields.email").exists())
                .andExpect(jsonPath("$.fields.name").exists())
                .andExpect(jsonPath("$.fields.message").exists());

        verify(messages, never()).save(any());
    }

    @Test
    void throttledSenderGets429() throws Exception {
        when(throttle.tryAcquire(any())).thenReturn(false);

        mvc.perform(post("/contact")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(payload("Jane", "jane@company.com", "Hello")))
                .andExpect(status().isTooManyRequests())
                .andExpect(header().exists("Retry-After"));

        verify(messages, never()).save(any());
    }
}
