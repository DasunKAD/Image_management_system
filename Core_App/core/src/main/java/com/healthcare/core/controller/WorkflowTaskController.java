package com.healthcare.core.controller;

import com.healthcare.common.dto.AppointmentCreateRequestDTO;
import com.healthcare.common.dto.DiagnosticReportRequestDTO;
import com.healthcare.common.dto.PatientRegistrationRequest;
import com.healthcare.common.enmus.TaskStatus;
import com.healthcare.common.service.AppointmentService;
import com.healthcare.common.service.WorkflowTaskService;
import com.healthcare.core.repository.WorkflowTaskRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/workflow-task")
@RequiredArgsConstructor
public class WorkflowTaskController {

    private final WorkflowTaskService workflowTaskService;

//    @GetMapping
//    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN', 'DOCTOR', 'RADIOLOGIST')")
//    public ResponseEntity<?> getAllPendingWorkflowTasks() {
//        return ResponseEntity.ok(workflowTaskService.getAllPendingTasksForImagingService());
//    }

    @PostMapping("/{taskId}/complete")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<?> completeWorkflowTask(
            @PathVariable("taskId") Long taskId,
            @RequestParam("status") String status,
            @RequestParam(value = "files", required = true) List<MultipartFile> files) {

        workflowTaskService.completeTasksForImagingService(taskId, status, files);

        return ResponseEntity.ok("Task " + taskId + " completed successfully");
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<?> getAllPendingWorkflowTasksForRadiologist(
            @RequestParam("status") TaskStatus status
    ) {
        return ResponseEntity.ok(workflowTaskService.getAllWorkflowTasks(status));
    }

    @GetMapping("/{taskId}")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<?> getTassById(
            @PathVariable("taskId") Long taskId
    ) {
        return ResponseEntity.ok(workflowTaskService.findTaskById(taskId));
    }

    @PostMapping("/submit/diagnostic-report")
    @PreAuthorize("hasAnyRole('ADMIN','TECHNICIAN', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<?> submitDiagnosticReport(@Valid @RequestBody DiagnosticReportRequestDTO request) {

        workflowTaskService.completedWorkflowReview(request);

        return ResponseEntity.ok("Task " + request + " Diagnostic Report completed successfully");
    }
}
