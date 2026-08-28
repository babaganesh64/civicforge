package com.civicforge.bulk.repository;

import com.civicforge.bulk.entity.BulkOperation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface BulkOperationRepository extends JpaRepository<BulkOperation, UUID> {
}
