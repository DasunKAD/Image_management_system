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
public class DiagnosticReportDTO {
    private Long taskId;
    private Long patientId;
    private Long visitId;
    private String diseaseClassification;
    private String findings;
}
