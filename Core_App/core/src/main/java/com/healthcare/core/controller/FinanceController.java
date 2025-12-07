package com.healthcare.core.controller;

import com.healthcare.common.dto.FinanceRegistrationRequest;
import com.healthcare.common.entity.FinanceStaff;
import com.healthcare.core.service.FinanceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/finance")
@RequiredArgsConstructor
public class FinanceController {

    private final FinanceService financeService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<FinanceStaff> registerFinanceStaff(@Valid @RequestBody FinanceRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(financeService.registerFinanceStaff(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    public ResponseEntity<List<FinanceStaff>> getAllFinanceStaff() {
        return ResponseEntity.ok(financeService.getAllFinanceStaff());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    public ResponseEntity<FinanceStaff> getFinanceStaffById(@PathVariable Long id) {
        return ResponseEntity.ok(financeService.getFinanceStaffById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteFinanceStaff(@PathVariable Long id) {
        financeService.deleteFinanceStaff(id);
        return ResponseEntity.noContent().build();
    }
}
