package com.healthcare.core.repository;

import com.healthcare.common.entity.Invoice;
import com.healthcare.common.entity.MedicalImage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface MedicalImageRepository extends JpaRepository<MedicalImage, Long> {
}
