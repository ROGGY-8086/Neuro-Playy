package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.PersonalQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PersonalQuestionRepository extends JpaRepository<PersonalQuestion, Long> {
    List<PersonalQuestion> findByUserIdAndActiveTrue(Long userId);
    List<PersonalQuestion> findByUserId(Long userId);
    Optional<PersonalQuestion> findByIdAndUserId(Long id, Long userId);
    void deleteByUserId(Long userId);
}
