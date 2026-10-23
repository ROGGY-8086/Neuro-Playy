package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String username;

    @Column(name = "username_normalized", nullable = false, unique = true, length = 100)
    private String usernameNormalized;

    @Column(unique = true, length = 150)
    private String email;

    @Column(name = "email_normalized", unique = true, length = 150)
    private String emailNormalized;

    @Column(name = "password_hash", nullable = false)
    private String passwordHash;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private Role role = Role.CAREGIVER;

    @Column(name = "player_profile_id", unique = true)
    private Long playerProfileId;

    @Column(nullable = false)
    private boolean enabled = true;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public User() {}

    public User(String name, String username, String email, String passwordHash, Role role) {
        this.name = name != null && !name.isBlank() ? name.trim() : username.trim();
        this.username = username.trim();
        this.usernameNormalized = username.trim().toLowerCase();
        this.email = email != null && !email.isBlank() ? email.trim() : null;
        this.emailNormalized = email != null && !email.isBlank() ? email.trim().toLowerCase() : null;
        this.passwordHash = passwordHash;
        this.role = role != null ? role : Role.CAREGIVER;
        this.enabled = true;
        this.createdAt = Instant.now();
    }

    public User(String name, String username, String email, String passwordHash, Role role, Long playerProfileId) {
        this(name, username, email, passwordHash, role);
        this.playerProfileId = playerProfileId;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
        if (username != null) {
            this.usernameNormalized = username.trim().toLowerCase();
        }
    }

    public String getUsernameNormalized() {
        return usernameNormalized;
    }

    public void setUsernameNormalized(String usernameNormalized) {
        this.usernameNormalized = usernameNormalized;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
        if (email != null) {
            this.emailNormalized = email.trim().toLowerCase();
        }
    }

    public String getEmailNormalized() {
        return emailNormalized;
    }

    public void setEmailNormalized(String emailNormalized) {
        this.emailNormalized = emailNormalized;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public Long getPlayerProfileId() {
        return playerProfileId;
    }

    public void setPlayerProfileId(Long playerProfileId) {
        this.playerProfileId = playerProfileId;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }
}
