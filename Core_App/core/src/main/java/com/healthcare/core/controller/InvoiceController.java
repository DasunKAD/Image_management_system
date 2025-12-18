package com.healthcare.core.controller;

import com.healthcare.common.dto.FinanceRegistrationRequest;
import com.healthcare.common.dto.InvoiceDTO;
import com.healthcare.common.dto.InvoiceStatusUpdateRequest;
import com.healthcare.common.entity.FinanceStaff;
import com.healthcare.core.service.FinanceService;
import com.healthcare.core.service.InvoiceService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/invoices")
@RequiredArgsConstructor
public class InvoiceController {

    private final InvoiceService invoiceService;

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    public ResponseEntity<List<InvoiceDTO>> getAllInvoices() {
        return ResponseEntity.ok(invoiceService.getAllInvoices());
    }

    @PostMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'FINANCE')")
    public ResponseEntity<Void> updateInvoiceStatus(
            @PathVariable Long id,
            @RequestBody InvoiceStatusUpdateRequest request) {
        invoiceService.updateStatus(id, request.getStatus());
        return ResponseEntity.noContent().build();
    }
}
