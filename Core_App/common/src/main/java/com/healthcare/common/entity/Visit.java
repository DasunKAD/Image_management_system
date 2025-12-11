package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "visit")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class Visit extends BaseEntity {

    @Column(name = "visit_No", unique = true)
    private String visitNo; // Public ID: "V_100"

    @ManyToOne
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    // Nullable for "Direct-to-Scan" scenario (Outpatient Referral)
    @ManyToOne
    @JoinColumn(name = "doctor_id")
    private Staff doctor;

    private String visitReason;
    private LocalDateTime checkInTime;
    private LocalDateTime checkOutTime;

    // One Visit = One Invoice
    @OneToOne(mappedBy = "visit", cascade = CascadeType.ALL)
    private Invoice invoice;

    @OneToMany(mappedBy = "visit")
    private List<WorkflowTask> tasks;
}