package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.MemoryItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoryItemRepository extends JpaRepository<MemoryItem, Long> {
    List<MemoryItem> findAllByPlayerIdOrderBySortOrderAsc(Long playerId);
    void deleteAllByPlayerId(Long playerId);
}
