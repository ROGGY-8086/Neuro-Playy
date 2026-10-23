package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.time.LocalDate;

public class RelativeDto {

    private Long id;
    private Long userId;

    @NotBlank(message = "Relative full name cannot be empty")
    @Size(max = 150, message = "Full name cannot exceed 150 characters")
    private String fullName;

    @NotBlank(message = "Relationship cannot be empty")
    @Size(max = 100, message = "Relationship cannot exceed 100 characters")
    private String relationship;

    private LocalDate dateOfBirth;
    private String importantDetails;

    public RelativeDto() {}

    public RelativeDto(Long id, String fullName, String relationship, LocalDate dateOfBirth, String importantDetails) {
        this.id = id;
        this.fullName = fullName;
        this.relationship = relationship;
        this.dateOfBirth = dateOfBirth;
        this.importantDetails = importantDetails;
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

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getRelationship() {
        return relationship;
    }

    public void setRelationship(String relationship) {
        this.relationship = relationship;
    }

    public LocalDate getDateOfBirth() {
        return dateOfBirth;
    }

    public void setDateOfBirth(LocalDate dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    public String getImportantDetails() {
        return importantDetails;
    }

    public void setImportantDetails(String importantDetails) {
        this.importantDetails = importantDetails;
    }
}
