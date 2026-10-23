package com.cognitiveplatform.dto;

import jakarta.validation.constraints.NotNull;

public class UpdatePatientStatusRequest {

    @NotNull(message = "Enabled status must be specified")
    private Boolean enabled;

    public UpdatePatientStatusRequest() {}

    public UpdatePatientStatusRequest(Boolean enabled) {
        this.enabled = enabled;
    }

    public Boolean getEnabled() {
        return enabled;
    }

    public void setEnabled(Boolean enabled) {
        this.enabled = enabled;
    }
}
