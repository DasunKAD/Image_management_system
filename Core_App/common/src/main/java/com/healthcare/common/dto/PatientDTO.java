package com.healthcare.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PatientDTO {
    private Long id;
    private Long userId;
    private String firstName;
    private String lastName;
    private String patientCode;
    private LocalDate dateOfBirth;
    private String gender;
    private String phoneNumber;
    private String address;
    private String email;
    private String bloodGroup;
    private String medicalHistory;
    private String allergies;
    private String emergencyContactName;
    private String emergencyContactPhone;

    // Computed/derived fields for convenience
    private String fullName;
    private Integer age;
    private Boolean minor;
    private Boolean senior;
    private Boolean hasAllergies;
    private Boolean hasEmergencyContact;
    private String ageCategory;

    private List<InvoiceDTO> invoices;
    private List<WorkflowTaskDetailsDTO> tasks;
}
