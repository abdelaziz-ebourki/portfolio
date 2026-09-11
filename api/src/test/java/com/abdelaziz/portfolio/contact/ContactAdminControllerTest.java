package com.abdelaziz.portfolio.contact;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.config.AdminAuth;
import com.abdelaziz.portfolio.config.JacksonConfig;

@WebMvcTest(ContactAdminController.class)
@Import(JacksonConfig.class)
class ContactAdminControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ContactMessageRepository messages;

    @MockitoBean
    private AdminAuth admin;

    @Test
    void listsMessagesForOwner() throws Exception {
        when(admin.configured()).thenReturn(true);
        when(admin.valid("Bearer test-admin")).thenReturn(true);
        var message = new ContactMessage("Jane", "jane@company.com", "Hello", "127.0.0.1");
        when(messages.findTop50ByOrderByCreatedAtDesc()).thenReturn(List.of(message));

        mvc.perform(get("/admin/messages").header("Authorization", "Bearer test-admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Jane"))
                .andExpect(jsonPath("$[0].email").value("jane@company.com"))
                .andExpect(jsonPath("$[0].read").value(false));
    }

    @Test
    void rejectsWrongTokenAndDisabledEndpoint() throws Exception {
        when(admin.configured()).thenReturn(true);

        mvc.perform(get("/admin/messages").header("Authorization", "Bearer nope"))
                .andExpect(status().isUnauthorized());

        when(admin.configured()).thenReturn(false);
        mvc.perform(get("/admin/messages").header("Authorization", "Bearer test-admin"))
                .andExpect(status().isServiceUnavailable());
    }

    @Test
    void marksMessageReadAndHandlesUnknownId() throws Exception, IllegalAccessException, NoSuchFieldException {
        when(admin.configured()).thenReturn(true);
        when(admin.valid("Bearer test-admin")).thenReturn(true);
        var message = new ContactMessage("Jane", "jane@company.com", "Hello", "127.0.0.1");
        var id = UUID.randomUUID();
        var idField = ContactMessage.class.getDeclaredField("id");
        idField.setAccessible(true);
        idField.set(message, id);
        when(messages.findById(id)).thenReturn(java.util.Optional.of(message));

        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/admin/messages/" + message.getId())
                        .header("Authorization", "Bearer test-admin"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.read").value(true));

        mvc.perform(org.springframework.test.web.servlet.request.MockMvcRequestBuilders
                        .patch("/admin/messages/" + UUID.randomUUID())
                        .header("Authorization", "Bearer test-admin"))
                .andExpect(status().isNotFound());
    }

    @Test
    void dtoCarriesIdAndTimestamp() {
        var dto = new ContactAdminController.MessageDto(
                UUID.randomUUID(), "Jane", "j@x.com", "Hi", Instant.now(), false);
        assert dto.name().equals("Jane");
    }
}
