package com.healthcare.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentServiceDTO {

    @NotNull(message = "Service ID is required")
    @Positive(message = "Service ID must be positive")
    private Long serviceId;

    @NotBlank(message = "Service code is required")
    @Size(max = 50, message = "Service code cannot exceed 50 characters")
    private String code;

    @Size(max = 500, message = "Clinic note cannot exceed 500 characters")
    private String clinicNote;
}
