package com.abdelaziz.portfolio.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.projects.ProjectCatalog;

@WebMvcTest(controllers = com.abdelaziz.portfolio.projects.ProjectController.class)
@Import({CorsConfig.class, JacksonConfig.class})
class CorsConfigTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProjectCatalog catalog;

    @Test
    void allowsConfiguredOrigin() throws Exception {
        mvc.perform(get("/projects").header("Origin", "http://localhost:5173"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));

        mvc.perform(options("/projects")
                        .header("Origin", "http://localhost:5173")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "http://localhost:5173"));
    }

    @Test
    void rejectsUnknownOrigin() throws Exception {
        mvc.perform(get("/projects").header("Origin", "https://evil.example.com"))
                .andExpect(status().isForbidden());
    }
}
