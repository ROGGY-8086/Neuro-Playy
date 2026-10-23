package com.cognitiveplatform.repository;

import com.cognitiveplatform.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    Optional<User> findByUsernameNormalized(String usernameNormalized);

    Optional<User> findByEmailNormalized(String emailNormalized);

    @Query("SELECT u FROM User u WHERE u.usernameNormalized = :identifier OR u.emailNormalized = :identifier")
    Optional<User> findByIdentifier(@Param("identifier") String identifier);

    boolean existsByUsernameNormalized(String usernameNormalized);

    boolean existsByEmailNormalized(String emailNormalized);

    Optional<User> findByPlayerProfileId(Long playerProfileId);

    boolean existsByPlayerProfileId(Long playerProfileId);

    default Optional<User> findByEmail(String email) {
        return findByEmailNormalized(email != null ? email.trim().toLowerCase() : "");
    }

    default boolean existsByEmail(String email) {
        return existsByEmailNormalized(email != null ? email.trim().toLowerCase() : "");
    }
}
