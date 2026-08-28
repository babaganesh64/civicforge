package com.civicforge.projects.repository;

import com.civicforge.projects.entity.ImpactMetric;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface ImpactMetricRepository extends JpaRepository<ImpactMetric, UUID> {
    List<ImpactMetric> findByProjectId(UUID projectId);
}
