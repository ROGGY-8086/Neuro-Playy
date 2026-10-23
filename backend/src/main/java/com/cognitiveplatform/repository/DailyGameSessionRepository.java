package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.DailyGameSession;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface DailyGameSessionRepository extends JpaRepository<DailyGameSession, Long> {
    Optional<DailyGameSession> findByUserIdAndGameDate(Long userId, LocalDate gameDate);
    Optional<DailyGameSession> findByUserIdAndGameDateAndStatus(Long userId, LocalDate gameDate, String status);
}
