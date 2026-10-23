package com.cognitiveplatform.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "life_events")
public class LifeEvent {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    @Column(name = "event_title", nullable = false, length = 200)
    private String eventTitle;

    @Column(name = "event_date")
    private LocalDate eventDate;

    @Column(name = "approximate_year")
    private Integer approximateYear;

    @Column(name = "event_place", length = 200)
    private String eventPlace;

    @Column(name = "people_involved", columnDefinition = "TEXT")
    private String peopleInvolved;

    @Column(name = "event_description", nullable = false, columnDefinition = "TEXT")
    private String eventDescription;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public LifeEvent() {}

    public LifeEvent(Long userId, String eventTitle, String eventDescription) {
        this.userId = userId;
        this.eventTitle = eventTitle;
        this.eventDescription = eventDescription;
        this.createdAt = Instant.now();
        this.updatedAt = Instant.now();
    }

    @PreUpdate
    public void preUpdate() {
        this.updatedAt = Instant.now();
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getEventTitle() {
        return eventTitle;
    }

    public void setEventTitle(String eventTitle) {
        this.eventTitle = eventTitle;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public Integer getApproximateYear() {
        return approximateYear;
    }

    public void setApproximateYear(Integer approximateYear) {
        this.approximateYear = approximateYear;
    }

    public String getEventPlace() {
        return eventPlace;
    }

    public void setEventPlace(String eventPlace) {
        this.eventPlace = eventPlace;
    }

    public String getPeopleInvolved() {
        return peopleInvolved;
    }

    public void setPeopleInvolved(String peopleInvolved) {
        this.peopleInvolved = peopleInvolved;
    }

    public String getEventDescription() {
        return eventDescription;
    }

    public void setEventDescription(String eventDescription) {
        this.eventDescription = eventDescription;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public Instant getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(Instant updatedAt) {
        this.updatedAt = updatedAt;
    }
}
