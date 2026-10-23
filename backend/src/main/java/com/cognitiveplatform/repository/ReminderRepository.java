package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.Reminder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReminderRepository extends JpaRepository<Reminder, Long> {
    List<Reminder> findAllByPlayerIdOrderByScheduledAtAsc(Long playerId);
    long countByPlayerIdAndEnabledTrue(Long playerId);
    void deleteAllByPlayerId(Long playerId);
}
