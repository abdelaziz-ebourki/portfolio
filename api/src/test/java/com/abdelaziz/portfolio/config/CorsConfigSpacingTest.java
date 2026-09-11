package com.abdelaziz.portfolio.config;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import com.abdelaziz.portfolio.projects.ProjectCatalog;

@WebMvcTest(controllers = com.abdelaziz.portfolio.projects.ProjectController.class)
@Import({CorsConfig.class, JacksonConfig.class})
@TestPropertySource(properties = "app.cors.allowed-origins=https://a.example.com, https://b.example.com")
class CorsConfigSpacingTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProjectCatalog catalog;

    @Test
    void trimsSpacesAroundOriginsAndExposesEtag() throws Exception {
        mvc.perform(get("/projects").header("Origin", "https://b.example.com"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://b.example.com"))
                .andExpect(header().string("Access-Control-Expose-Headers", "ETag"));
    }
}
