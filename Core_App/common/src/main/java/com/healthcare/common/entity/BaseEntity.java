package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import lombok.experimental.SuperBuilder;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.io.Serializable;
import java.time.LocalDateTime;

/**
 * Base Entity - Abstract class demonstrating OO Inheritance
 * 
 * Design Patterns Applied:
 * - Template Method Pattern: Common audit fields for all entities
 * - DRY Principle: Avoid duplication of timestamp fields
 * 
 * OO Concepts:
 * - Inheritance: All entities extend this base class
 * - Encapsulation: Private fields with controlled access
 * - Abstraction: Abstract class cannot be instantiated
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@MappedSuperclass
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public abstract class BaseEntity implements Serializable {

    private static final long serialVersionUID = 1L;

    /**
     * Primary key for all entities
     * Uses IDENTITY strategy for PostgreSQL compatibility
     */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", updatable = false, nullable = false)
    private Long id;

    /**
     * Automatic timestamp when entity is created
     * Demonstrates use of JPA lifecycle callbacks
     */
    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * Automatic timestamp when entity is updated
     * Demonstrates use of JPA lifecycle callbacks
     */
    @UpdateTimestamp
    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    /**
     * Soft delete flag for maintaining data integrity
     * Demonstrates business logic in entity layer
     */
    @Column(name = "deleted", nullable = false)
    private Boolean deleted = false;

    /**
     * Business method for soft deletion
     * Demonstrates encapsulation of business logic
     */
    public void softDelete() {
        this.deleted = true;
    }

    /**
     * Business method to restore soft deleted entity
     * Demonstrates encapsulation of business logic
     */
    public void restore() {
        this.deleted = false;
    }

    /**
     * Check if entity is new (not persisted yet)
     * Useful for service layer logic
     */
    @Transient
    public boolean isNew() {
        return this.id == null;
    }
}
