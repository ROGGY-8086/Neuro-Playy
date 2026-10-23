package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.CaregiverObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CaregiverObservationRepository extends JpaRepository<CaregiverObservation, Long> {
    List<CaregiverObservation> findAllByPlayerIdOrderByCreatedAtDesc(Long playerId);
    void deleteAllByPlayerId(Long playerId);
}
