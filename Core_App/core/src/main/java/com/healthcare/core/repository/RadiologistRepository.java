package com.healthcare.core.repository;

import com.healthcare.common.entity.Radiologist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RadiologistRepository extends JpaRepository<Radiologist, Long> {
    Optional<Radiologist> findByUserId(Long userId);
    Boolean existsByUserId(Long userId);
    Boolean existsByLicenseNumber(String licenseNumber);
}
