package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Doctor Entity - Medical professionals
 * 
 * OO Concepts: Inheritance from BaseEntity, Encapsulation, Business methods
 * Demonstrates specialized medical staff with credentials
 */
@Entity
@Table(name = "doctors", indexes = {
    @Index(name = "idx_doctor_user_id", columnList = "user_id"),
    @Index(name = "idx_doctor_specialization", columnList = "specialization"),
    @Index(name = "idx_doctor_license", columnList = "license_number")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class Doctor extends BaseEntity {

    @Column(name = "user_id", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private Long userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    @Column(name = "specialization", length = 100)
    private String specialization;

    @Column(name = "license_number", unique = true, length = 50)
    private String licenseNumber;

    @Column(name = "qualifications", length = 500)
    private String qualifications;

    @Column(name = "experience_years", nullable = false)
    @Builder.Default
    private Integer experienceYears = 0;

    @Column(name = "consultation_fee")
    private Double consultationFee;

    @Column(name = "available_for_consultation", nullable = false)
    @Builder.Default
    private Boolean availableForConsultation = true;

    // Business methods
    public String getFullName() {
        return "Dr. " + this.firstName + " " + this.lastName;
    }

    public boolean isExperienced() {
        return this.experienceYears >= 5;
    }

    public void makeAvailable() {
        this.availableForConsultation = true;
    }

    public void makeUnavailable() {
        this.availableForConsultation = false;
    }
}
