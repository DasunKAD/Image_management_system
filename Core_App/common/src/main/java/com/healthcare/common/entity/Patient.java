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

    /**
     * Reference to User entity in SSO database
     * One-to-one relationship
     * This links authentication to patient profile
     */
    @Column(name = "user_id", nullable = false, unique = true)
    @EqualsAndHashCode.Include
    private Long userId;

    /**
     * Patient's first name
     */
    @Column(name = "first_name", nullable = false, length = 100)
    private String firstName;

    /**
     * Patient's last name
     */
    @Column(name = "last_name", nullable = false, length = 100)
    private String lastName;

    /**
     * Date of birth - used for age calculation
     */
    @Column(name = "date_of_birth", nullable = false)
    private LocalDate dateOfBirth;

    /**
     * Gender
     * Could be enhanced with enum for type safety
     */
    @Column(name = "gender", length = 20)
    private String gender;

    /**
     * Contact phone number
     */
    @Column(name = "phone_number", length = 20)
    private String phoneNumber;

    /**
     * Residential address
     */
    @Column(name = "address", length = 500)
    private String address;

    /**
     * Blood group (A+, B+, O-, etc.)
     */
    @Column(name = "blood_group", length = 10)
    private String bloodGroup;

    /**
     * Medical history - stored as text
     * In production, this could be a separate entity
     */
    @Column(name = "medical_history", columnDefinition = "TEXT")
    private String medicalHistory;

    /**
     * Known allergies
     * Critical for treatment decisions
     */
    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    /**
     * Emergency contact name
     */
    @Column(name = "emergency_contact_name", length = 100)
    private String emergencyContactName;

    /**
     * Emergency contact phone
     */
    @Column(name = "emergency_contact_phone", length = 20)
    private String emergencyContactPhone;

    // ===== Business Methods =====

    /**
     * Get patient's full name
     * Demonstrates encapsulation of formatting logic
     * 
     * @return Full name
     */
    public String getFullName() {
        return this.firstName + " " + this.lastName;
    }

    /**
     * Calculate patient's current age
     * Demonstrates business logic in domain model
     * 
     * @return Age in years
     */
    public int getAge() {
        if (this.dateOfBirth == null) {
            return 0;
        }
        return Period.between(this.dateOfBirth, LocalDate.now()).getYears();
    }

    /**
     * Check if patient is a minor (under 18)
     * 
     * @return true if patient is under 18
     */
    public boolean isMinor() {
        return getAge() < 18;
    }

    /**
     * Check if patient is a senior (65 or older)
     * 
     * @return true if patient is 65 or older
     */
    public boolean isSenior() {
        return getAge() >= 65;
    }

    /**
     * Check if patient has any known allergies
     * 
     * @return true if allergies are documented
     */
    public boolean hasAllergies() {
        return this.allergies != null && !this.allergies.trim().isEmpty();
    }

    /**
     * Check if emergency contact is available
     * 
     * @return true if emergency contact is set
     */
    public boolean hasEmergencyContact() {
        return this.emergencyContactName != null && 
               !this.emergencyContactName.trim().isEmpty() &&
               this.emergencyContactPhone != null && 
               !this.emergencyContactPhone.trim().isEmpty();
    }

    /**
     * Get age category for reporting
     * Demonstrates business categorization
     * 
     * @return Age category string
     */
    public String getAgeCategory() {
        int age = getAge();
        if (age < 18) return "Child";
        if (age < 65) return "Adult";
        return "Senior";
    }
}
