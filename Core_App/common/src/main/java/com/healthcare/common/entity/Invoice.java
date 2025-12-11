package com.healthcare.common.entity;

import com.healthcare.common.enmus.PaymentStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;
import java.util.List;

@Entity
@Table(name = "invoice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class Invoice extends BaseEntity {

    @Column(name = "invoice_No", unique = true)
    private String invoiceNO; // Public ID: "INV_555"

    @OneToOne
    @JoinColumn(name = "visit_id", referencedColumnName = "id")
    private Visit visit;

    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    private PaymentStatus status; // OPEN, PAID

    @OneToMany(mappedBy = "invoice", cascade = CascadeType.ALL)
    private List<BillItem> billItems;
}
