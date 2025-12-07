package com.healthcare.core.service;

import com.healthcare.common.dto.PatientRegistrationRequest;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.Patient;
import com.healthcare.core.repository.PatientRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;
    private final SsoClient ssoClient;

    @Transactional
    public Patient registerPatient(PatientRegistrationRequest request) {
        // Create user in SSO with PATIENT group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("PATIENTS")
        );

        // Create patient record in Core DB
        Patient patient = Patient.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .medicalHistory(request.getMedicalHistory())
                .allergies(request.getAllergies())
                .build();

        return patientRepository.save(patient);
    }

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Patient getPatientByUserId(Long userId) {
        return patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found with userId: " + userId));
    }

    @Transactional
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }
}
