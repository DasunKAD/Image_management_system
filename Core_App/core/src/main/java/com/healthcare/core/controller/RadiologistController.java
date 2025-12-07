package com.healthcare.core.controller;

import com.healthcare.common.dto.RadiologistRegistrationRequest;
import com.healthcare.common.entity.Radiologist;
import com.healthcare.core.service.RadiologistService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/radiologists")
@RequiredArgsConstructor
public class RadiologistController {

    private final RadiologistService radiologistService;

    @PostMapping("/register")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Radiologist> registerRadiologist(@Valid @RequestBody RadiologistRegistrationRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(radiologistService.registerRadiologist(request));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RADIOLOGIST')")
    public ResponseEntity<List<Radiologist>> getAllRadiologists() {
        return ResponseEntity.ok(radiologistService.getAllRadiologists());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RADIOLOGIST')")
    public ResponseEntity<Radiologist> getRadiologistById(@PathVariable Long id) {
        return ResponseEntity.ok(radiologistService.getRadiologistById(id));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteRadiologist(@PathVariable Long id) {
        radiologistService.deleteRadiologist(id);
        return ResponseEntity.noContent().build();
    }
}
