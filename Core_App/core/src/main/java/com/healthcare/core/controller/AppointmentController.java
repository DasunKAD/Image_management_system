package com.healthcare.core.controller;

import com.healthcare.common.dto.AppointmentCreateRequestDTO;
import com.healthcare.common.dto.PatientRegistrationRequest;
import com.healthcare.common.entity.Patient;
import com.healthcare.common.service.AppointmentService;
import com.healthcare.core.service.PatientService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/appointments")
@RequiredArgsConstructor
public class AppointmentController {

    private final AppointmentService appointmentService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN','STAFF', 'DOCTOR', 'RADIOLOGIST')")
    public ResponseEntity<?> createAppointment(
            @Valid @RequestBody AppointmentCreateRequestDTO requestDTO) {

        var response = appointmentService.createAppointment(requestDTO);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }
}
