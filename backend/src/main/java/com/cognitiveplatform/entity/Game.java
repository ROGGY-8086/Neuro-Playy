package com.cognitiveplatform.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "games")
public class Game {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "game_key", nullable = false, unique = true, length = 50)
    private String gameKey;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(nullable = false, length = 100)
    private String category;

    @Column(nullable = false)
    private boolean enabled = true;

    public Game() {}

    public Game(String gameKey, String title, String category, boolean enabled) {
        this.gameKey = gameKey;
        this.title = title;
        this.category = category;
        this.enabled = enabled;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getGameKey() {
        return gameKey;
    }

    public void setGameKey(String gameKey) {
        this.gameKey = gameKey;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public boolean isEnabled() {
        return enabled;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}
