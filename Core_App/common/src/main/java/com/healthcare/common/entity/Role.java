package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

/**
 * Role Entity - Represents system roles with type-safe enum
 * 
 * OO Concepts Demonstrated:
 * - Encapsulation: Private fields with getters/setters
 * - Type Safety: Using enum for role names
 * - Immutability: Role name should not change after creation
 * 
 * Design Patterns:
 * - Value Object Pattern: Role represents a value in the system
 * - Enumeration Pattern: Limited, well-defined set of roles
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@Entity
@Table(name = "roles", indexes = {
    @Index(name = "idx_role_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true)
public class Role extends BaseEntity {

    /**
     * Role Name Enumeration
     * Demonstrates: Type safety, compile-time checking, clear contract
     */
    public enum RoleName {
        ROLE_PATIENT("Patient Role - Access to patient portal"),
        ROLE_DOCTOR("Doctor Role - Access to medical records and patient data"),
        ROLE_ADMIN("Administrator Role - Full system access"),
        ROLE_FINANCE("Finance Role - Access to billing and financial data"),
        ROLE_RADIOLOGIST("Radiologist Role - Access to imaging and radiology data");

        private final String description;

        RoleName(String description) {
            this.description = description;
        }

        public String getDescription() {
            return description;
        }

        /**
         * Get display name without ROLE_ prefix
         * Demonstrates encapsulation of formatting logic
         */
        public String getDisplayName() {
            return this.name().replace("ROLE_", "").toLowerCase();
        }
    }

    /**
     * Role name - stored as string in database
     * Uses enum for type safety in application layer
     */
    @Enumerated(EnumType.STRING)
    @Column(name = "name", unique = true, nullable = false, length = 50)
    @EqualsAndHashCode.Include
    private RoleName name;

    /**
     * Human-readable description of the role
     * Demonstrates separation of technical name and user-friendly description
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Indicates if this role is active in the system
     * Demonstrates business logic for role lifecycle management
     */
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    /**
     * Business method to activate role
     * Encapsulates business logic
     */
    public void activate() {
        this.active = true;
    }

    /**
     * Business method to deactivate role
     * Encapsulates business logic
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * Check if role is administrative
     * Demonstrates encapsulation of business rules
     */
    public boolean isAdministrative() {
        return this.name == RoleName.ROLE_ADMIN;
    }

    /**
     * Check if role can access patient data
     * Demonstrates encapsulation of authorization logic
     */
    public boolean canAccessPatientData() {
        return this.name == RoleName.ROLE_ADMIN ||
               this.name == RoleName.ROLE_DOCTOR ||
               this.name == RoleName.ROLE_RADIOLOGIST;
    }

    /**
     * Check if role can access financial data
     * Demonstrates encapsulation of authorization logic
     */
    public boolean canAccessFinancialData() {
        return this.name == RoleName.ROLE_ADMIN ||
               this.name == RoleName.ROLE_FINANCE;
    }
}
