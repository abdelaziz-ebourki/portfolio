package com.abdelaziz.portfolio.sync;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

/** No ADMIN_TOKEN configured → the endpoint stays disabled. */
@WebMvcTest(SyncAdminController.class)
class SyncAdminDisabledTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProjectSyncService sync;

    @Test
    void disabledWithoutToken() throws Exception {
        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer anything")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"example/taskboard\"}"))
                .andExpect(status().isServiceUnavailable());
    }
}
