package com.healthcare.core.repository;

import com.healthcare.common.entity.DiagnosticReport;
import com.healthcare.common.entity.FinanceStaff;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiagnosticReportRepository extends JpaRepository<DiagnosticReport, Long> {
}
