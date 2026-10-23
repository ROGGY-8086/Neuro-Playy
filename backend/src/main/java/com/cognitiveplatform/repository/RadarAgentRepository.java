package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.RadarAgentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RadarAgentRepository extends JpaRepository<RadarAgentEntity, Long> {
    List<RadarAgentEntity> findAllByOrderByIdAsc();
}
