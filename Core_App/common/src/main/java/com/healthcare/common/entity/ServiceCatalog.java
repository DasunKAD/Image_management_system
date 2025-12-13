package com.healthcare.common.entity;
import com.healthcare.common.enmus.ServiceCatalogCategory;
import com.healthcare.common.enmus.TaskStatus;
import lombok.*;
import jakarta.persistence.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Entity
@Table(name = "service_catalog")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class ServiceCatalog extends BaseEntity {

    @Column(name = "service_code", unique = true, nullable = false, length = 100)
    private String serviceCode; // e.g., "SVC_CT"

    private String description; // e.g., "CT Scan Head"
    private BigDecimal unitCost;

    @Enumerated(EnumType.STRING)
    private ServiceCatalogCategory category;
}
