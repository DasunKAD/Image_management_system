package com.healthcare.common.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Patient Entity - Represents patient information in the healthcare system
 * 
 * OO Concepts Demonstrated:
 * - Encapsulation: Private fields with business logic methods
 * - Domain Modeling: Healthcare-specific attributes and behavior
 * - Data Validation: Constraints on medical data
 * 
 * Business Rules:
 * - Each patient is linked to a User entity (one-to-one)
 * - Patient data is sensitive and requires careful handling
 * - Age is calculated from date of birth
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@Entity
@Table(name = "unique_key", indexes = {
    @Index(name = "idx_unique_key_code", columnList = "unique_code")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true)
public class UniqueCode extends BaseEntity {

    @Column(name = "unique_code", nullable = false, unique = true)
    private String uniqueCode;
}
