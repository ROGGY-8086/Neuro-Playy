package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.UserSettingsEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserSettingsRepository extends JpaRepository<UserSettingsEntity, Long> {
    Optional<UserSettingsEntity> findByUserId(Long userId);
}
