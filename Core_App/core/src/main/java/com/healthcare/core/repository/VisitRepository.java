package com.healthcare.core.repository;

import com.healthcare.common.entity.Staff;
import com.healthcare.common.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface VisitRepository extends JpaRepository<Visit, Long> {
}
