package com.abdelaziz.portfolio.projects;

import java.util.Base64;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.stereotype.Component;

import com.abdelaziz.portfolio.sync.Project;
import com.abdelaziz.portfolio.sync.ProjectRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

/** Read model over synced projects: ordered DTO list + cover assets. */
@Component
public class ProjectCatalog {

    private final ProjectRepository projects;
    private final ObjectMapper mapper;

    public ProjectCatalog(ProjectRepository projects, ObjectMapper mapper) {
        this.projects = projects;
        this.mapper = mapper;
    }

    public List<Map<String, Object>> list() {
        return projects.findAll()
                .stream()
                .map(p -> ProjectMapper.toDto(mapper, p.getSlug(), p.getManifest()))
                .sorted(Comparator.comparingInt(dto -> dto.path("displayOrder").asInt(0)))
                .map(dto -> mapper.<Map<String, Object>>convertValue(dto,
                        new TypeReference<Map<String, Object>>() {
                        }))
                .toList();
    }

    public Optional<CoverAsset> cover(String slug) {
        return projects.findBySlug(slug).map(project -> coverFrom(project.getManifest()));
    }

    private CoverAsset coverFrom(String storedManifest) {
        try {
            var cover = mapper.readTree(storedManifest).path("cover");
            if (!cover.isObject() || !cover.hasNonNull("data")) {
                return null;
            }
            byte[] bytes = Base64.getDecoder().decode(cover.path("data").asText());
            String contentType = cover.path("contentType").asText("application/octet-stream");
            return new CoverAsset(bytes, contentType);
        } catch (Exception e) {
            throw new IllegalStateException("Stored cover bytes are corrupt", e);
        }
    }
}
