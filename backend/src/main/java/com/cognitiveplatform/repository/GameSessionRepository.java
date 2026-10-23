package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.GameSession;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;

@Repository
public interface GameSessionRepository extends JpaRepository<GameSession, Long> {

    Page<GameSession> findAllByPlayerId(Long playerId, Pageable pageable);

    @Query("SELECT s FROM GameSession s WHERE s.playerId = :playerId " +
           "AND (:gameKey IS NULL OR s.gameKey = :gameKey) " +
           "AND (:fromTime IS NULL OR s.startedAt >= :fromTime) " +
           "AND (:toTime IS NULL OR s.startedAt <= :toTime)")
    Page<GameSession> findFiltered(
            @Param("playerId") Long playerId,
            @Param("gameKey") String gameKey,
            @Param("fromTime") Instant fromTime,
            @Param("toTime") Instant toTime,
            Pageable pageable
    );

    List<GameSession> findTop10ByPlayerIdOrderByStartedAtDesc(Long playerId);

    List<GameSession> findTop10ByPlayerIdAndGameKeyOrderByStartedAtDesc(Long playerId, String gameKey);

    long countByPlayerId(Long playerId);

    long countByPlayerIdAndGameKey(Long playerId, String gameKey);

    void deleteAllByPlayerId(Long playerId);
}
