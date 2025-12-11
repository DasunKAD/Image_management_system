package com.healthcare.common.dto;

import com.healthcare.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.math.BigDecimal;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ServiceCatalogDTO {
    private Long id;
    private String serviceCode; // e.g., "SVC_CT"
    private String description; // e.g., "CT Scan Head"
    private BigDecimal unitCost;
}
