package com.healthcare.common.dto;

import com.healthcare.common.enmus.TaskStatus;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowTaskDetailsDTO {

    private Long taskId;
    private String taskNo;
    private String status;
    private String priority;
    private LocalDateTime createdOn;
    private LocalDateTime completedOn;
    private LocalDateTime uploadDate;
    private String description;
    private String modality;


    // Patient Details (Flattened)
    private Long patientId;
    private String patientName;
    private String patientDateOfBirth;
    private String patientGender;
    private String patientMedicalRecordNumber;
    private String patientEmail;
    private String patientPhone;
    private String patientMedicalHistory;

    // Visit Details (Flattened)
    private Long visitId;
    private String visitReason;
    private String visitDoctorName;

    // Images
    private List<String> images;

    // Visit History
    private List<VisitHistoryDTO> visitHistory;
}