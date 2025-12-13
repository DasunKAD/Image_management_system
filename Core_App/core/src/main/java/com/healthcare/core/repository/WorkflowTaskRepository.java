package com.healthcare.core.repository;

import com.healthcare.common.enmus.ServiceCatalogCategory;
import com.healthcare.common.enmus.TaskStatus;
import com.healthcare.common.entity.Invoice;
import com.healthcare.common.entity.WorkflowTask;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowTaskRepository extends JpaRepository<WorkflowTask, Long> {
    @Query("""
        SELECT DISTINCT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH mi.patient p
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient vp
        LEFT JOIN FETCH wt.assignedStaff s
        WHERE wt.status = :status
        ORDER BY wt.createdOn ASC
        """)
    List<WorkflowTask> findAllByStatusWithDetails(@Param("status") TaskStatus status);

    @Query("""
    SELECT DISTINCT wt FROM WorkflowTask wt
    LEFT JOIN FETCH wt.medicalImage mi
    LEFT JOIN FETCH mi.patient p
    LEFT JOIN FETCH wt.visit v
    LEFT JOIN FETCH v.patient vp
    LEFT JOIN FETCH wt.assignedStaff s
    WHERE wt.status = :status
    AND wt.id IN (
        SELECT bi.sourceTask.id FROM BillItem bi
        WHERE bi.serviceCatalog.category = :category
    )
    ORDER BY wt.createdOn ASC
    """)
    List<WorkflowTask> findAllByStatusAndServiceCategoryWithDetails(
            @Param("status") TaskStatus status,
            @Param("category") ServiceCatalogCategory category
    );

    @Query("""
        SELECT DISTINCT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH mi.patient p
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient vp
        WHERE wt.status = :status 
        AND wt.assignedStaff.id = :staffId
        ORDER BY wt.createdOn ASC
        """)
    List<WorkflowTask> findPendingTasksByStaffId(
            @Param("status") TaskStatus status,
            @Param("staffId") Long staffId
    );

    @Query("""
        SELECT DISTINCT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH mi.patient p
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient vp
        LEFT JOIN FETCH wt.assignedStaff s
        WHERE wt.status = :status 
        AND wt.taskType = :taskType
        ORDER BY wt.createdOn ASC
        """)
    List<WorkflowTask> findPendingTasksByType(
            @Param("status") TaskStatus status,
            @Param("taskType") TaskStatus taskType
    );

    @Query("""
        SELECT DISTINCT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient p
        WHERE wt.status = :status 
        AND p.id = :patientId
        ORDER BY wt.createdOn ASC
        """)
    List<WorkflowTask> findPendingTasksByPatientId(
            @Param("status") TaskStatus status,
            @Param("patientId") Long patientId
    );

    @Query("SELECT COUNT(wt) FROM WorkflowTask wt WHERE wt.status = :status")
    Long countByStatus(@Param("status") TaskStatus status);

    @Query("""
        SELECT COUNT(wt) FROM WorkflowTask wt 
        WHERE wt.status = :status 
        AND wt.assignedStaff.id = :staffId
        """)
    Long countPendingTasksByStaffId(
            @Param("status") TaskStatus status,
            @Param("staffId") Long staffId
    );

    @Query("""
        SELECT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH mi.patient p
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient vp
        WHERE wt.id = :taskId
        """)
    Optional<WorkflowTask> findTaskWithImageAndPatientDetails(@Param("taskId") Long taskId);

    @Query("""
        SELECT wt FROM WorkflowTask wt
        LEFT JOIN FETCH wt.medicalImage mi
        LEFT JOIN FETCH mi.patient p
        LEFT JOIN FETCH wt.visit v
        LEFT JOIN FETCH v.patient vp
        LEFT JOIN FETCH wt.assignedStaff s
        WHERE wt.taskNo = :taskNo
        """)
    Optional<WorkflowTask> findByTaskNoWithDetails(@Param("taskNo") String taskNo);
}