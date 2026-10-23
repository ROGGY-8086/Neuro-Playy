package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.DailyScore;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface DailyScoreRepository extends JpaRepository<DailyScore, Long> {
    Optional<DailyScore> findByUserIdAndGameDate(Long userId, LocalDate gameDate);
    boolean existsByUserIdAndGameDate(Long userId, LocalDate gameDate);
    List<DailyScore> findByUserIdOrderByGameDateDesc(Long userId);
    long countByUserId(Long userId);
}
