package com.healthcare.core.service;

import com.healthcare.common.dto.DiagnosticReportRequestDTO;
import com.healthcare.common.dto.WorkFlowTaskDTO;
import com.healthcare.common.dto.WorkflowTaskDetailsDTO;
import com.healthcare.common.enmus.ServiceCatalogCategory;
import com.healthcare.common.entity.DiagnosticReport;
import com.healthcare.common.entity.MedicalImage;
import com.healthcare.common.entity.WorkflowTask;
import com.healthcare.common.enmus.TaskStatus;
import com.healthcare.common.service.WorkflowTaskService;
import com.healthcare.core.repository.DiagnosticReportRepository;
import com.healthcare.core.repository.MedicalImageRepository;
import com.healthcare.core.repository.WorkflowTaskRepository;
import com.healthcare.core.util.S3Service;
import com.healthcare.core.util.UniqueCodeGenerator;
import jakarta.persistence.Lob;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class WorkflowTaskServiceImpl implements WorkflowTaskService {

    private final WorkflowTaskRepository workflowTaskRepository;
    private final MedicalImageRepository medicalImageRepository;
    private final S3Service s3Service;
    private final DiagnosticReportRepository diagnosticReportRepository;
    private final UniqueCodeGenerator uniqueCodeGenerator;

    // Get all PENDING tasks as DTOs
    public List<WorkflowTaskDetailsDTO> getAllPendingTasksForImagingService() {
        return workflowTaskRepository.findAllByStatusAndServiceCategoryWithDetails(TaskStatus.PENDING, ServiceCatalogCategory.IMAGING_SERVICES)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public void completeTask(Long taskId, String status, List<MultipartFile> files) {

        System.out.printf("Task %s completed successfully\n", taskId);
    }

    @Override
    @Transactional
    public List<WorkFlowTaskDTO> completeTasksForImagingService(Long taskId, String status, List<MultipartFile> files) {
        WorkflowTask workflowTask = workflowTaskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Workflow task not found with id: " + taskId));
        workflowTask.setStatus(TaskStatus.PENDING_REVIEW);

        MedicalImage medicalImage = Optional.of(workflowTask.getMedicalImage()).orElseThrow(() -> new RuntimeException("Medical not not found with id: " + taskId));
        medicalImage.setUploadDate(LocalDateTime.now());
        files.forEach(file -> {
            String uniqueKey = "IMS/"+taskId + "-" + UUID.randomUUID() + "-" + file.getOriginalFilename();

            try {
                String keyname = s3Service.uploadFile(uniqueKey, file.getBytes());
                medicalImage.addFileUrl(keyname);
            } catch (IOException e) {
                throw new RuntimeException(e);
            }
        });
        workflowTask.setMedicalImage(medicalImage);
        workflowTaskRepository.save(workflowTask);
        return List.of();
    }

    @Override
    public List<WorkFlowTaskDTO> getAllWorkflowTasks(TaskStatus taskStatus) {
        return workflowTaskRepository.findAllByStatusAndServiceCategoryWithDetails(taskStatus, ServiceCatalogCategory.IMAGING_SERVICES)
                .stream()
                .map(this::mapToTaskDTO)
                .collect(Collectors.toList());
    }

    @Override
    public WorkflowTaskDetailsDTO findTaskById(Long taskId) {
        WorkflowTask workflowTask = workflowTaskRepository.findById(taskId).orElseThrow(() -> new RuntimeException("Workflow task not found with id: " + taskId));
        return mapToDTO(workflowTask);
    }

    @Override
    @Transactional
    public void completedWorkflowReview(DiagnosticReportRequestDTO request) {
        WorkflowTask workflowTask = workflowTaskRepository.findById(request.getTaskId()).orElseThrow(() -> new RuntimeException("Workflow task not found with id: " + request.getFindings()));
        workflowTask.setStatus(TaskStatus.COMPLETED);
        workflowTask.setCompletedOn(LocalDateTime.now());
        workflowTaskRepository.save(workflowTask);

        DiagnosticReport diagnosticReport = new DiagnosticReport();
        diagnosticReport.setReportNo(uniqueCodeGenerator.generateUniqueCode());
        diagnosticReport.setReportDate(LocalDateTime.now());
        diagnosticReport.setMedicalImage(workflowTask.getMedicalImage());
        diagnosticReport.setDiseaseClassification(request.getDiseaseClassification());
        diagnosticReport.setFindings(request.getFindings());
        diagnosticReport.setFinalized(Boolean.TRUE);

        diagnosticReportRepository.save(diagnosticReport);
    }

    // Get PENDING tasks for a specific staff member
    public List<WorkflowTask> getPendingTasksByStaff(Long staffId) {
        return workflowTaskRepository.findPendingTasksByStaffId(TaskStatus.PENDING, staffId);
    }

    // Get PENDING tasks by type
    public List<WorkflowTask> getPendingTasksByType(TaskStatus taskType) {
        return workflowTaskRepository.findPendingTasksByType(TaskStatus.PENDING, taskType);
    }

    // Get PENDING tasks for a patient
    public List<WorkflowTask> getPendingTasksByPatient(Long patientId) {
        return workflowTaskRepository.findPendingTasksByPatientId(TaskStatus.PENDING, patientId);
    }

    // Get count of PENDING tasks
    public Long getPendingTasksCount() {
        return workflowTaskRepository.countByStatus(TaskStatus.PENDING);
    }

    // Get count of PENDING tasks for a staff member
    public Long getPendingTasksCountByStaff(Long staffId) {
        return workflowTaskRepository.countPendingTasksByStaffId(TaskStatus.PENDING, staffId);
    }

    private WorkflowTaskDetailsDTO mapToDTO(WorkflowTask task) {
        WorkflowTaskDetailsDTO.WorkflowTaskDetailsDTOBuilder builder = WorkflowTaskDetailsDTO.builder()
                .taskId(task.getId())
                .taskNo(task.getTaskNo())
                .status(task.getStatus().name())
                .description(task.getDescription())
                .createdOn(task.getCreatedOn())
                .completedOn(task.getCompletedOn());

        // Add Medical Image details if present
        if (task.getMedicalImage() != null) {
            builder.images(generateUrls(task.getMedicalImage().getFileUrls()))
                    .modality(task.getMedicalImage().getModality())
                    .uploadDate(task.getMedicalImage().getUploadDate());

            if (task.getMedicalImage().getPatient() != null) {
                builder.patientId(task.getMedicalImage().getPatient().getId());
            }
        }

        // Add Visit details
        if (task.getVisit() != null) {
            builder.visitId(task.getVisit().getId());
//                    .visitNo(task.getVisit().getVisitNo());

            if (task.getVisit().getPatient() != null) {
                builder.patientId(task.getVisit().getPatient().getId());
                builder.patientName(task.getVisit().getPatient().getFullName());
            }
        }

        // Add assigned staff details
        if (task.getAssignedStaff() != null) {
//            builder.assignedStaffId(task.getAssignedStaff().getId());
        }

        return builder.build();
    }

    private List<String> generateUrls(List<String> fileUrls) {
        List<String> urls = new ArrayList<>();
        if (!fileUrls.isEmpty()) {
            fileUrls.forEach(fileUrl -> {
                urls.add(s3Service.getPresignedUrl(fileUrl));
            });
        }
        return urls;
    }

    private WorkFlowTaskDTO mapToTaskDTO(WorkflowTask task) {
        WorkFlowTaskDTO.WorkFlowTaskDTOBuilder builder = WorkFlowTaskDTO.builder();
            builder.taskId(task.getId())
                    .taskNo(task.getTaskNo())
                    .status(task.getStatus().name())
                    .description(task.getDescription())
                    .createdOn(task.getCreatedOn());

        // Add Medical Image details if present
        if (task.getMedicalImage() != null) {
            builder.scanDate(task.getMedicalImage().getUploadDate())
                    .completedOn(task.getCompletedOn())
                    .modality(task.getMedicalImage().getModality())
                    .attachmentCount(task.getMedicalImage().getFileUrls().size());

            if (task.getMedicalImage().getPatient() != null) {
                builder.patientId(task.getMedicalImage().getPatient().getId())
                        .patientName(task.getMedicalImage().getPatient().getFullName())
                        .patientNumber(task.getMedicalImage().getPatient().getId().toString());
            }
        }

        // Add Visit details
        if (task.getVisit() != null) {
            builder.visitId(task.getVisit().getId())
                    .visitNo(task.getVisit().getVisitNo())
                    .visitReason(task.getVisit().getVisitReason())
                    .visitDoctorName("");

            if (task.getVisit().getPatient() != null) {
                builder.patientId(task.getVisit().getPatient().getId());
                builder.patientName(task.getVisit().getPatient().getFullName());
            }
        }

        return builder.build();
    }
}
