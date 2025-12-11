package com.healthcare.common.dto;
import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AppointmentCreateRequestDTO {

    @NotNull(message = "Date is required")
    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate date;

    @NotNull(message = "Time is required")
    @JsonFormat(pattern = "HH:mm")
    private LocalTime time;

    @Size(max = 1000, message = "Notes cannot exceed 1000 characters")
    private String notes;

    private String status;

    @NotNull(message = "Patient ID is required")
    @Positive(message = "Patient ID must be positive")
    private Long patientId;

    @NotBlank(message = "Patient name is required")
    @Size(max = 200, message = "Patient name cannot exceed 200 characters")
    private String patientName;

    private Long doctorId;

    @Size(max = 200, message = "Doctor name cannot exceed 200 characters")
    private String doctorName;

    @NotBlank(message = "Appointment type is required")
    private String type;

    @NotEmpty(message = "At least one service is required")
    @Valid
    private List<AppointmentServiceDTO> services;
}
