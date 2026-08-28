package com.civicforge.bulk.repository;

import com.civicforge.bulk.entity.BulkOperationItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BulkOperationItemRepository extends JpaRepository<BulkOperationItem, UUID> {
    List<BulkOperationItem> findByBulkOperationId(UUID bulkOperationId);
}
