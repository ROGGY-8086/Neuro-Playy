package com.cognitiveplatform.dto;

import com.cognitiveplatform.entity.Role;

public class UserDto {
    private Long id;
    private String name;
    private String username;
    private String email;
    private Role role;
    private Long playerProfileId;

    public UserDto() {}

    public UserDto(Long id, String name, String username, String email, Role role) {
        this.id = id;
        this.name = name;
        this.username = username;
        this.email = email;
        this.role = role;
    }

    public UserDto(Long id, String name, String username, String email, Role role, Long playerProfileId) {
        this(id, name, username, email, role);
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
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
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
}
