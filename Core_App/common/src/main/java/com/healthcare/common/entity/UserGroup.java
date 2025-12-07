package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * UserGroup Entity - Represents groups that aggregate roles
 * 
 * OO Concepts Demonstrated:
 * - Association: Many-to-many relationship with Role entity
 * - Encapsulation: Controlled access to role collection
 * - Business Logic: Methods to manage group membership
 * 
 * Design Patterns:
 * - Composite Pattern: Groups contain multiple roles
 * - Collection Management: Proper handling of bidirectional relationships
 * 
 * Use Case:
 * Groups like "DOCTORS", "PATIENTS" can have multiple roles assigned
 * Makes role management more flexible and maintainable
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@Entity
@Table(name = "user_groups", indexes = {
    @Index(name = "idx_group_name", columnList = "name")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true, exclude = "roles")
public class UserGroup extends BaseEntity {

    /**
     * Unique name of the user group
     * Examples: DOCTORS, PATIENTS, ADMINS, FINANCE_STAFF, RADIOLOGISTS
     */
    @Column(name = "name", unique = true, nullable = false, length = 100)
    @EqualsAndHashCode.Include
    private String name;

    /**
     * Description of the group's purpose
     */
    @Column(name = "description", length = 500)
    private String description;

    /**
     * Roles assigned to this group
     * 
     * Demonstrates:
     * - Many-to-Many relationship
     * - Eager fetching for small datasets
     * - Join table management
     * - Cascade operations
     */
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "user_group_roles",
        joinColumns = @JoinColumn(name = "user_group_id"),
        inverseJoinColumns = @JoinColumn(name = "role_id"),
        indexes = {
            @Index(name = "idx_ugr_group", columnList = "user_group_id"),
            @Index(name = "idx_ugr_role", columnList = "role_id")
        }
    )
    @Builder.Default
    private Set<Role> roles = new HashSet<>();

    /**
     * Indicates if this group is active
     */
    @Column(name = "active", nullable = false)
    private Boolean active = true;

    // ===== Business Methods - Demonstrates Encapsulation =====

    /**
     * Add a role to this group
     * Demonstrates encapsulation of collection management
     * 
     * @param role The role to add
     * @return true if role was added, false if already present
     */
    public boolean addRole(Role role) {
        if (role == null || !role.getActive()) {
            return false;
        }
        return this.roles.add(role);
    }

    /**
     * Remove a role from this group
     * 
     * @param role The role to remove
     * @return true if role was removed, false if not present
     */
    public boolean removeRole(Role role) {
        return this.roles.remove(role);
    }

    /**
     * Check if group has a specific role
     * 
     * @param roleName The role name to check
     * @return true if group has the role
     */
    public boolean hasRole(Role.RoleName roleName) {
        return this.roles.stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    /**
     * Get all role names as strings
     * Useful for API responses
     * 
     * @return Set of role names
     */
    public Set<String> getRoleNames() {
        return this.roles.stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }

    /**
     * Check if group has administrative privileges
     * Demonstrates business logic encapsulation
     * 
     * @return true if group has admin role
     */
    public boolean isAdministrative() {
        return hasRole(Role.RoleName.ROLE_ADMIN);
    }

    /**
     * Clear all roles from this group
     */
    public void clearRoles() {
        this.roles.clear();
    }

    /**
     * Get number of roles in this group
     * 
     * @return count of roles
     */
    public int getRoleCount() {
        return this.roles.size();
    }

    /**
     * Activate this group
     */
    public void activate() {
        this.active = true;
    }

    /**
     * Deactivate this group
     */
    public void deactivate() {
        this.active = false;
    }

    /**
     * Check if group is empty (no roles assigned)
     * 
     * @return true if no roles assigned
     */
    public boolean isEmpty() {
        return this.roles.isEmpty();
    }
}
