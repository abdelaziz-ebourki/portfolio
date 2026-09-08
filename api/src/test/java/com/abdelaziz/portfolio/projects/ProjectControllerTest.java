package com.abdelaziz.portfolio.projects;

import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.HttpHeaders;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

@WebMvcTest(ProjectController.class)
class ProjectControllerTest {

    @Autowired
    private MockMvc mvc;

    @MockitoBean
    private ProjectCatalog catalog;

    @Test
    void listsProjects() throws Exception {
        Map<String, Object> dto = new LinkedHashMap<>();
        dto.put("slug", "taskboard");
        dto.put("cover", null);
        when(catalog.list()).thenReturn(List.of(dto));

        mvc.perform(get("/projects"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].slug").value("taskboard"));
    }

    @Test
    void servesCoverWithEtagAnd304() throws Exception {
        byte[] bytes = { 1, 2, 3 };
        when(catalog.cover("taskboard"))
                .thenReturn(Optional.of(new CoverAsset(bytes, "image/png")));

        MvcResult first = mvc.perform(get("/projects/taskboard/cover"))
                .andExpect(status().isOk())
                .andExpect(content().contentType("image/png"))
                .andExpect(content().bytes(bytes))
                .andExpect(header().exists(HttpHeaders.ETAG))
                .andReturn();
        String etag = first.getResponse().getHeader(HttpHeaders.ETAG);

        mvc.perform(get("/projects/taskboard/cover").header("If-None-Match", etag))
                .andExpect(status().isNotModified());
    }

    @Test
    void cover404WhenMissing() throws Exception {
        when(catalog.cover("ghost")).thenReturn(Optional.empty());

        mvc.perform(get("/projects/ghost/cover")).andExpect(status().isNotFound());
    }
}
