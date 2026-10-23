package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.GardenState;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GardenStateRepository extends JpaRepository<GardenState, Long> {
    Optional<GardenState> findByPlayerId(Long playerId);
    void deleteByPlayerId(Long playerId);
}
