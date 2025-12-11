package com.healthcare.common.entity;

import com.healthcare.common.enmus.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "workflow_task")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class WorkflowTask extends BaseEntity {
    @Column(name = "task_no", unique = true)
    private String taskNo;

    @ManyToOne
    @JoinColumn(name = "visit_id")
    private Visit visit;

    // Optional: A task might not have an image yet (e.g., Pending Scan)
    @OneToOne
    @JoinColumn(name = "image_id")
    private MedicalImage medicalImage;

    @ManyToOne
    @JoinColumn(name = "assigned_staff_id")
    private Staff assignedStaff;

    @Enumerated(EnumType.STRING)
    private TaskStatus taskType;

    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @Column(length = 5000)
    private String description;// e.g., "MRI Head with Contrast - Check for tumor"

    private LocalDateTime createdOn;
    private LocalDateTime completedOn;
    // One Task can have multiple attachment pages (Page 1, Page 2)
    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL)
    private List<TaskAttachment> attachments;
}