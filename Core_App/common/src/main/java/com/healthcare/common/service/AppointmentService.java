package com.healthcare.common.service;

import com.healthcare.common.dto.AppointmentCreateRequestDTO;
import com.healthcare.common.dto.ServiceCatalogDTO;
import jakarta.validation.Valid;

import java.util.List;

public interface AppointmentService {

    Object createAppointment(@Valid AppointmentCreateRequestDTO requestDTO);
}
