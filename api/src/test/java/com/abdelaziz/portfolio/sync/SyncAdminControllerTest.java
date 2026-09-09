package com.abdelaziz.portfolio.sync;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.config.JacksonConfig;
import com.abdelaziz.portfolio.github.GitHubFileNotFoundException;
import com.abdelaziz.portfolio.manifest.InvalidManifestException;

@WebMvcTest(value = SyncAdminController.class, properties = "admin.token=test-admin")
@Import(JacksonConfig.class)
class SyncAdminControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProjectSyncService sync;

    @Test
    void syncsAndReportsCoverPresence() throws Exception {
        Project project = new Project("example/taskboard", "taskboard",
                "{\"slug\":\"taskboard\",\"cover\":{}}", "blob1");
        when(sync.sync(eq("example/taskboard"), eq("main"))).thenReturn(project);

        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer test-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"example/taskboard\",\"ref\":\"main\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.slug").value("taskboard"))
                .andExpect(jsonPath("$.syncedSha").value("blob1"))
                .andExpect(jsonPath("$.hasCover").value(true));
    }

    @Test
    void rejectsWrongTokenAndMalformedRepo() throws Exception {
        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer nope")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"example/taskboard\"}"))
                .andExpect(status().isUnauthorized());

        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer test-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"not a repo\"}"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void mapsSyncFailuresToStatusCodes() throws Exception {
        when(sync.sync(eq("example/broken"), any()))
                .thenThrow(new InvalidManifestException("Manifest violates schema: boom"));
        when(sync.sync(eq("example/gone"), any()))
                .thenThrow(new GitHubFileNotFoundException("example/gone", ".portfolio.json"));

        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer test-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"example/broken\"}"))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.error").value("Manifest violates schema: boom"));

        mvc.perform(post("/admin/sync")
                        .header("Authorization", "Bearer test-admin")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"repo\":\"example/gone\"}"))
                .andExpect(status().isNotFound());
    }
}
