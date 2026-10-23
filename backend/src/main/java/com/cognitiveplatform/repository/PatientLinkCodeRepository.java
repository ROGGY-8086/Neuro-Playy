package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.PatientLinkCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PatientLinkCodeRepository extends JpaRepository<PatientLinkCode, Long> {

    Optional<PatientLinkCode> findByCode(String code);

    Optional<PatientLinkCode> findByCodeAndUsedFalse(String code);

    Optional<PatientLinkCode> findTopByPlayerProfileIdAndUsedFalseOrderByCreatedAtDesc(Long playerProfileId);
}
