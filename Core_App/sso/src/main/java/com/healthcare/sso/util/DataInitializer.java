package com.healthcare.sso.util;

import com.healthcare.common.dto.CreateUserRequest;
import com.healthcare.sso.service.AuthService;
import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Set;

@Component
public class DataInitializer {

    @Autowired
    private final AuthService authService; // Your JPA repository

    public DataInitializer(AuthService authService) {
        this.authService = authService;
    }

    @PostConstruct
    public void init() {
            CreateUserRequest admin = new CreateUserRequest();
            admin.setPassword("admin123");
            admin.setEmail("admin@hospital.com");
            admin.setUsername("admin@hospital.com");
            admin.setGroupNames(Set.of("ADMINS"));

            CreateUserRequest doctor = new CreateUserRequest();
            doctor.setPassword("doctor123");
            doctor.setEmail("doctor@hospital.com");
            doctor.setUsername("doctor@hospital.com");
            doctor.setGroupNames(Set.of("DOCTORS"));

            CreateUserRequest radio = new CreateUserRequest();
            radio.setPassword("radio123");
            radio.setEmail("radiologist@hospital.com");
            radio.setUsername("radiologist@hospital.com");
            radio.setGroupNames(Set.of("RADIOLOGISTS"));

            CreateUserRequest finance = new CreateUserRequest();
            finance.setPassword("finance123");
            finance.setEmail("finance@hospital.com");
            finance.setUsername("finance@hospital.com");
            finance.setGroupNames(Set.of("FINANCE"));

            CreateUserRequest patient = new CreateUserRequest();
            patient.setPassword("patient123");
            patient.setEmail("patient@gmail.com");
            patient.setUsername("patient@gmail.com");
            patient.setGroupNames(Set.of("PATIENTS"));

            CreateUserRequest technician = new CreateUserRequest();
            technician.setPassword("technician123");
            technician.setEmail("technician@hospital.com");
            technician.setUsername("technician@hospital.com");
            technician.setGroupNames(Set.of("TECHNICIANS"));

            CreateUserRequest staff = new CreateUserRequest();
            staff.setPassword("staff123");
            staff.setEmail("staff@hospital.com");
            staff.setUsername("staff@hospital.com");
            staff.setGroupNames(Set.of("STAFFS"));

        List<CreateUserRequest> users = List.of(admin, doctor, radio, finance, patient, technician, staff);

        users.forEach(u -> {
            try {
                authService.createUser(u);
            } catch (Exception e) {
                System.out.println("Skipping error: " + u.getUsername() + " => " + e.getMessage());
            }
        });


    }
}

