package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import java.time.LocalDateTime;

@Entity
@Table(name = "task_attachment")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class TaskAttachment extends BaseEntity {

    // Link to the specific Work Order (Task)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "task_id", nullable = false)
    private WorkflowTask task;

    @Column(nullable = false)
    private String fileUrl; // "s3://bucket/referrals/ref_letter_01.pdf"

    @Column(nullable = false)
    private String fileName; // "referral_letter.pdf"

    private LocalDateTime uploadedAt;
}
