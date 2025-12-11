package com.healthcare.core.controller;

import com.healthcare.common.dto.ServiceCatalogDTO;
import com.healthcare.common.dto.StaffRegistrationRequest;
import com.healthcare.common.entity.Staff;
import com.healthcare.common.service.ServiceCatalogService;
import com.healthcare.core.service.StaffService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/data")
@RequiredArgsConstructor
public class DataController {

    private final ServiceCatalogService serviceCatalogService;

    @GetMapping("/service-catalogs")
    @PreAuthorize("hasAnyRole('ADMIN', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<List<ServiceCatalogDTO>> registerStaff() {
        return ResponseEntity.status(HttpStatus.OK).body(serviceCatalogService.getAllServiceCatalogs());
    }
}
