package com.cognitiveplatform.dto;

public class CohortTestimonialDto {
    private String id;
    private String quote;
    private String name;
    private String title;
    private String avatar;
    private String avatarBg;
    private int streakDays;
    private int scorePts;

    public CohortTestimonialDto() {}

    public CohortTestimonialDto(String id, String quote, String name, String title, String avatar, String avatarBg, int streakDays, int scorePts) {
        this.id = id;
        this.quote = quote;
        this.name = name;
        this.title = title;
        this.avatar = avatar;
        this.avatarBg = avatarBg;
        this.streakDays = streakDays;
        this.scorePts = scorePts;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getQuote() {
        return quote;
    }

    public void setQuote(String quote) {
        this.quote = quote;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getAvatar() {
        return avatar;
    }

    public void setAvatar(String avatar) {
        this.avatar = avatar;
    }

    public String getAvatarBg() {
        return avatarBg;
    }

    public void setAvatarBg(String avatarBg) {
        this.avatarBg = avatarBg;
    }

    public int getStreakDays() {
        return streakDays;
    }

    public void setStreakDays(int streakDays) {
        this.streakDays = streakDays;
    }

    public int getScorePts() {
        return scorePts;
    }

    public void setScorePts(int scorePts) {
        this.scorePts = scorePts;
    }
}
