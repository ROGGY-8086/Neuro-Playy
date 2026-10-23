package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.LifeEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface LifeEventRepository extends JpaRepository<LifeEvent, Long> {
    List<LifeEvent> findByUserId(Long userId);
    Optional<LifeEvent> findByIdAndUserId(Long id, Long userId);
    void deleteByUserId(Long userId);
}
