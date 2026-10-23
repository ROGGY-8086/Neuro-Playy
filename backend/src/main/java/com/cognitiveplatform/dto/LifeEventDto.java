package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class LifeEventDto {

    private Long id;
    private Long userId;

    @NotBlank(message = "Event title cannot be empty")
    @Size(max = 200, message = "Event title cannot exceed 200 characters")
    private String eventTitle;

    private LocalDate eventDate;
    private Integer approximateYear;

    @Size(max = 200, message = "Event place cannot exceed 200 characters")
    private String eventPlace;

    private String peopleInvolved;

    @NotBlank(message = "Event description cannot be empty")
    private String eventDescription;

    public LifeEventDto() {}

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
}
