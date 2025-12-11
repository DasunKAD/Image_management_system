package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "bill_item")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class BillItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", nullable = false)
    private Invoice invoice;

    // Links charge to the specific catalog item (Price)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "service_id", nullable = false)
    private ServiceCatalog serviceCatalog;

    // Links charge to the actual work performed (Audit Trail)
    // Optional because some fees (like Registration) might not have a "task"
    @OneToOne
    @JoinColumn(name = "source_task_id")
    private WorkflowTask sourceTask;

    @Column(name = "charged_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal chargedAmount; // Snapshot of price at time of billing
}