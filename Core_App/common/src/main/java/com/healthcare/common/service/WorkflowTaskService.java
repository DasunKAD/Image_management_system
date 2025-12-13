package com.healthcare.common.service;

import com.healthcare.common.dto.DiagnosticReportRequestDTO;
import com.healthcare.common.dto.WorkFlowTaskDTO;
import com.healthcare.common.dto.WorkflowTaskDetailsDTO;
import com.healthcare.common.enmus.TaskStatus;
import jakarta.validation.Valid;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface WorkflowTaskService {
    List<WorkflowTaskDetailsDTO> getAllPendingTasksForImagingService();

    void completeTask(Long taskId, String status, List<MultipartFile> files);
    List<WorkFlowTaskDTO> completeTasksForImagingService(Long taskId, String status, List<MultipartFile> files);

    List<WorkFlowTaskDTO> getAllWorkflowTasks(TaskStatus taskStatus);
    WorkflowTaskDetailsDTO findTaskById(Long taskId);

    void completedWorkflowReview(@Valid DiagnosticReportRequestDTO request);
}
