package com.healthcare.core.service;

import com.healthcare.common.dto.DoctorRegistrationRequest;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.Doctor;
import com.healthcare.core.repository.DoctorRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class DoctorService {

    private final DoctorRepository doctorRepository;
    private final SsoClient ssoClient;

    @Transactional
    public Doctor registerDoctor(DoctorRegistrationRequest request) {
        if (doctorRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }

        // Create user in SSO with DOCTOR group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("DOCTORS")
        );

        // Create doctor record in Core DB
        Doctor doctor = Doctor.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .specialization(request.getSpecialization())
                .licenseNumber(request.getLicenseNumber())
                .qualifications(request.getQualifications())
                .experienceYears(request.getExperienceYears())
                .build();

        return doctorRepository.save(doctor);
    }

    @Transactional(readOnly = true)
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Doctor getDoctorById(Long id) {
        return doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Doctor not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public Doctor getDoctorByUserId(Long userId) {
        return doctorRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Doctor not found with userId: " + userId));
    }

    @Transactional
    public void deleteDoctor(Long id) {
        doctorRepository.deleteById(id);
    }
}
