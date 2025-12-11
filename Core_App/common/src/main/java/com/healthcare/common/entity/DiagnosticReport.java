package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "diagnostic_report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class DiagnosticReport extends BaseEntity {

    @Column(name = "report_no", unique = true)
    private String reportNo;

    @OneToOne
    @JoinColumn(name = "image_id")
    private MedicalImage medicalImage;

    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Staff doctor;

    // The Requirement: "Classify by type of disease"
    private String diseaseClassification; // "Lung Cancer", "Normal", "Fracture"

    @Lob
    private String findings; // Detailed text

    private boolean isFinalized;
    private LocalDateTime reportDate;
}
