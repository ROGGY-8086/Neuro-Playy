package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.Relative;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RelativeRepository extends JpaRepository<Relative, Long> {
    List<Relative> findByUserId(Long userId);
    Optional<Relative> findByIdAndUserId(Long id, Long userId);
    void deleteByUserId(Long userId);
}
