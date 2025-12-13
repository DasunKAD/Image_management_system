package com.healthcare.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkFlowTaskDTO {
    private Long taskId;
    private String taskNo;
    private String taskType;
    private String status;
    private String description;

    private LocalDateTime createdOn;
    private LocalDateTime scanDate;
    private LocalDateTime completedOn;

    private String modality;
    private Integer attachmentCount;

    private Long patientId;
    private String patientName;
    private String patientNumber;

    private Long visitId;
    private String visitNo;
    private String visitReason;
    private String visitDoctorName;
}
