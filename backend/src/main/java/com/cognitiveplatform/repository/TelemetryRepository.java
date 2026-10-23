package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.TelemetryEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface TelemetryRepository extends JpaRepository<TelemetryEntity, Long> {
    Optional<TelemetryEntity> findTopByOrderByIdAsc();
}
