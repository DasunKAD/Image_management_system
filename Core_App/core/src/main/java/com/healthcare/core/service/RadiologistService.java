package com.healthcare.core.service;

import com.healthcare.common.dto.RadiologistRegistrationRequest;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.Radiologist;
import com.healthcare.core.repository.RadiologistRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class RadiologistService {

    private final RadiologistRepository radiologistRepository;
    private final SsoClient ssoClient;

    @Transactional
    public Radiologist registerRadiologist(RadiologistRegistrationRequest request) {
        if (radiologistRepository.existsByLicenseNumber(request.getLicenseNumber())) {
            throw new RuntimeException("License number already exists");
        }

        // Create user in SSO with RADIOLOGIST group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("RADIOLOGISTS")
        );

        // Create radiologist record in Core DB
        Radiologist radiologist = Radiologist.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .licenseNumber(request.getLicenseNumber())
                .specialization(request.getSpecialization())
                .experienceYears(request.getExperienceYears())
                .build();

        return radiologistRepository.save(radiologist);
    }

    @Transactional(readOnly = true)
    public List<Radiologist> getAllRadiologists() {
        return radiologistRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Radiologist getRadiologistById(Long id) {
        return radiologistRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Radiologist not found with id: " + id));
    }

    @Transactional
    public void deleteRadiologist(Long id) {
        radiologistRepository.deleteById(id);
    }
}
