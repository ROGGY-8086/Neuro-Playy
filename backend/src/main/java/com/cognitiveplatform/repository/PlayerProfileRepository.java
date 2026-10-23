package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.PlayerProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlayerProfileRepository extends JpaRepository<PlayerProfile, Long> {
    List<PlayerProfile> findAllByCaregiverId(Long caregiverId);
    Optional<PlayerProfile> findByIdAndCaregiverId(Long id, Long caregiverId);
}
