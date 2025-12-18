package com.healthcare.core.repository;

import com.healthcare.common.entity.Staff;
import com.healthcare.common.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
    @Query("SELECT DISTINCT v FROM Visit v " +
            "LEFT JOIN FETCH v.invoice i " +
            "LEFT JOIN FETCH v.tasks t " +
            "LEFT JOIN FETCH t.medicalImage mi " +
            "WHERE v.patient.id = :patientId " +
            "ORDER BY v.checkInTime DESC")
    List<Visit> findAllByPatientIdWithDetails(@Param("patientId") Long patientId);
}
