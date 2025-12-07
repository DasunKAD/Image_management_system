package com.healthcare.core.service;

import com.healthcare.common.dto.StaffRegistrationRequest;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.Staff;
import com.healthcare.core.repository.StaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class StaffService {

    private final StaffRepository staffRepository;
    private final SsoClient ssoClient;

    @Transactional
    public Staff registerStaff(StaffRegistrationRequest request) {
        // Create user in SSO with STAFF group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("STAFF")
        );

        // Create staff record in Core DB
        Staff staff = Staff.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .department(request.getDepartment())
                .position(request.getPosition())
                .build();

        return staffRepository.save(staff);
    }

    @Transactional(readOnly = true)
    public List<Staff> getAllStaff() {
        return staffRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Staff getStaffById(Long id) {
        return staffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Staff not found with id: " + id));
    }

    @Transactional
    public void deleteStaff(Long id) {
        staffRepository.deleteById(id);
    }
}
