package com.civicforge.organizations.repository;

import com.civicforge.organizations.entity.Organization;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface OrganizationRepository extends JpaRepository<Organization, UUID> {
    Page<Organization> findByOrgTypeAndActive(String orgType, boolean active, Pageable pageable);
    List<Organization> findByActive(boolean active);
}
