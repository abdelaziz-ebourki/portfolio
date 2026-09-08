package com.abdelaziz.portfolio.sync;

import java.util.Optional;
import java.util.UUID;

import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, UUID> {

    Optional<Project> findByRepoFullName(String repoFullName);

    Optional<Project> findBySlug(String slug);
}
