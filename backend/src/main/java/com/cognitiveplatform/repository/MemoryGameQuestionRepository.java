package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.MemoryGameQuestion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface MemoryGameQuestionRepository extends JpaRepository<MemoryGameQuestion, Long> {

    List<MemoryGameQuestion> findAllByPlayerProfileIdOrderBySortOrderAsc(Long playerProfileId);

    void deleteAllByPlayerProfileId(Long playerProfileId);

    long countByPlayerProfileId(Long playerProfileId);
}
