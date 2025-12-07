package com.healthcare.core.service;

import com.healthcare.common.dto.FinanceRegistrationRequest;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.FinanceStaff;
import com.healthcare.core.repository.FinanceStaffRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Slf4j
public class FinanceService {

    private final FinanceStaffRepository financeStaffRepository;
    private final SsoClient ssoClient;

    @Transactional
    public FinanceStaff registerFinanceStaff(FinanceRegistrationRequest request) {
        // Create user in SSO with FINANCE group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("FINANCE")
        );

        // Create finance staff record in Core DB
        FinanceStaff financeStaff = FinanceStaff.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .phoneNumber(request.getPhoneNumber())
                .department(request.getDepartment())
                .position(request.getPosition())
                .build();

        return financeStaffRepository.save(financeStaff);
    }

    @Transactional(readOnly = true)
    public List<FinanceStaff> getAllFinanceStaff() {
        return financeStaffRepository.findAll();
    }

    @Transactional(readOnly = true)
    public FinanceStaff getFinanceStaffById(Long id) {
        return financeStaffRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Finance staff not found with id: " + id));
    }

    @Transactional
    public void deleteFinanceStaff(Long id) {
        financeStaffRepository.deleteById(id);
    }
}
