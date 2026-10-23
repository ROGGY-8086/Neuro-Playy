package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.ConsentRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ConsentRecordRepository extends JpaRepository<ConsentRecord, Long> {
    List<ConsentRecord> findAllByPlayerId(Long playerId);
    Optional<ConsentRecord> findByPlayerIdAndConsentType(Long playerId, String consentType);
    void deleteAllByPlayerId(Long playerId);
}
