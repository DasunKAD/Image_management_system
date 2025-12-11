package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDate;
import java.time.Period;

/**
 * Patient Entity - Represents patient information in the healthcare system
 * 
 * OO Concepts Demonstrated:
 * - Encapsulation: Private fields with business logic methods
 * - Domain Modeling: Healthcare-specific attributes and behavior
 * - Data Validation: Constraints on medical data
 * 
 * Business Rules:
 * - Each patient is linked to a User entity (one-to-one)
 * - Patient data is sensitive and requires careful handling
 * - Age is calculated from date of birth
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@Entity
@Table(name = "patients", indexes = {
    @Index(name = "idx_patient_user_id", columnList = "user_id"),
    @Index(name = "idx_patient_dob", columnList = "date_of_birth"),
    @Index(name = "idx_patient_blood_group", columnList = "blood_group")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true)
public class Patient extends BaseEntity {
    @Column(name = "user_id", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private Long userId;

    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;
    @Column(name = "patient_code", nullable = false, length = 10, unique = true)
    private String patientCode;
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;
    @Column(name = "gender", length = 20)
    private String gender;
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;
    @Column(name = "address", length = 500)
    private String address;
    @Column(name = "email", unique = true, nullable = true, length = 100)
    private String email;
    @Column(name = "blood_group", length = 10)
    private String bloodGroup;
    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;
    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;
    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;
    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }
    public int getAge() {
        if (this.dateOfBirth == null) {
            return 0;
        }
        return Period.between(this.dateOfBirth, LocalDate.now()).getYears();
    }
    public boolean isMinor() {
        return getAge() < 18;
    }
    public boolean isSenior() {
        return getAge() >= 65;
    }
    public boolean hasAllergies() {
        return this.allergies != null && !this.allergies.trim().isEmpty();
    }
    public boolean hasEmergencyContact() {
        return this.emergencyContactName != null && 
               !this.emergencyContactName.trim().isEmpty() &&
               this.emergencyContactPhone != null && 
               !this.emergencyContactPhone.trim().isEmpty();
    }
    public String getAgeCategory() {
        int age = getAge();
        if (age < 18) return "Child";
        if (age < 65) return "Adult";
        return "Senior";
    }
}
