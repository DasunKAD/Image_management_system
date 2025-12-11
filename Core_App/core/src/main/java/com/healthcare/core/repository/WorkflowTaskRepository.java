package com.healthcare.core.repository;

import com.healthcare.common.entity.Invoice;
import com.healthcare.common.entity.WorkflowTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface WorkflowTaskRepository extends JpaRepository<WorkflowTask, Long> {
}
