package com.cognitiveplatform.dto;

public class GameResponse {
    private Long id;
    private String gameKey;
    private String title;
    private String category;
    private boolean enabled;

    public GameResponse() {}

    public GameResponse(Long id, String gameKey, String title, String category, boolean enabled) {
        this.id = id;
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
