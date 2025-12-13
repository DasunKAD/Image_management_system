package com.healthcare.common.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DiagnosticReportRequestDTO {

    @NotNull(message = "taskId is required")
    private Long taskId;
    private Long patientId;
    private Long visitId;

    @NotBlank(message = "diseaseClassification is required")
    private String diseaseClassification;
    @NotBlank(message = "findings is required")
    private String findings;
}
