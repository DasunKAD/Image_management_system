package com.healthcare.core.repository;

import com.healthcare.common.entity.Doctor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DoctorRepository extends JpaRepository<Doctor, Long> {
    Optional<Doctor> findByUserId(Long userId);
    Boolean existsByUserId(Long userId);
    Boolean existsByLicenseNumber(String licenseNumber);
}
