package com.healthcare.common.entity;

import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;

import java.util.Collection;
import java.util.HashSet;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * User Entity - Core authentication and authorization entity
 * 
 * OO Concepts Demonstrated:
 * - Encapsulation: Private fields with controlled access
 * - Association: Many-to-many relationship with UserGroup
 * - Business Logic: Password management, account status
 * 
 * Security Features:
 * - Password stored as encrypted hash (BCrypt)
 * - Account status flags (locked, expired, enabled)
 * - Role-based access through groups
 * 
 * Design Patterns:
 * - Value Object: Email, username are value objects
 * - State Pattern: Account status (enabled, locked, expired)
 * 
 * @author Healthcare Development Team
 * @version 1.0
 */
@Entity
@Table(name = "users", indexes = {
    @Index(name = "idx_user_username", columnList = "username"),
    @Index(name = "idx_user_email", columnList = "email"),
    @Index(name = "idx_user_enabled", columnList = "enabled")
})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
@ToString(callSuper = true, exclude = {"password", "userGroups"})
public class User extends BaseEntity {

    /**
     * Unique username for authentication
     * Used as principal in security context
     */
    @Column(name = "username", unique = true, nullable = false, length = 100)
    @EqualsAndHashCode.Include
    private String username;

    /**
     * Unique email address
     * Can be used for password recovery and notifications
     */
    @Column(name = "email", unique = true, nullable = false, length = 100)
    private String email;

    /**
     * Encrypted password (BCrypt hash)
     * NEVER store plain text passwords
     * 
     * Security Note:
     * - Excluded from toString() to prevent logging
     * - Should only be set through secure methods
     */
    @Column(name = "password", nullable = false, length = 255)
    private String password;

    /**
     * Account enabled flag
     * Disabled accounts cannot authenticate
     */
    @Column(name = "enabled", nullable = false)
    @Builder.Default
    private Boolean enabled = true;

    /**
     * Account non-expired flag
     * Expired accounts need reactivation
     */
    @Column(name = "account_non_expired", nullable = false)
    @Builder.Default
    private Boolean accountNonExpired = true;

    /**
     * Account non-locked flag
     * Locked accounts need admin intervention
     */
    @Column(name = "account_non_locked", nullable = false)
    @Builder.Default
    private Boolean accountNonLocked = true;

    /**
     * Credentials non-expired flag
     * Expired credentials require password change
     */
    @Column(name = "credentials_non_expired", nullable = false)
    @Builder.Default
    private Boolean credentialsNonExpired = true;

    /**
     * User groups - provides role-based access
     * 
     * Demonstrates:
     * - Many-to-Many relationship
     * - Eager fetching for authentication
     * - Cascade operations for group management
     */
    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(
        name = "user_user_groups",
        joinColumns = @JoinColumn(name = "user_id"),
        inverseJoinColumns = @JoinColumn(name = "user_group_id"),
        indexes = {
            @Index(name = "idx_uug_user", columnList = "user_id"),
            @Index(name = "idx_uug_group", columnList = "user_group_id")
        }
    )
    @Builder.Default
    private Set<UserGroup> userGroups = new HashSet<>();

    /**
     * Failed login attempts counter
     * Used for account locking mechanism
     */
    @Column(name = "failed_login_attempts", nullable = false)
    @Builder.Default
    private Integer failedLoginAttempts = 0;

    // ===== Business Methods - User Group Management =====

    /**
     * Add user to a group
     * Demonstrates encapsulation of collection management
     * 
     * @param group The group to join
     * @return true if user was added to group
     */
    public boolean addToGroup(UserGroup group) {
        if (group == null || !group.getActive()) {
            return false;
        }
        return this.userGroups.add(group);
    }

    /**
     * Remove user from a group
     * 
     * @param group The group to leave
     * @return true if user was removed from group
     */
    public boolean removeFromGroup(UserGroup group) {
        return this.userGroups.remove(group);
    }

    /**
     * Check if user belongs to a specific group
     * 
     * @param groupName The group name to check
     * @return true if user is in the group
     */
    public boolean isMemberOf(String groupName) {
        return this.userGroups.stream()
                .anyMatch(group -> group.getName().equals(groupName));
    }

    /**
     * Get all groups user belongs to
     * 
     * @return Set of group names
     */
    public Set<String> getGroupNames() {
        return this.userGroups.stream()
                .map(UserGroup::getName)
                .collect(Collectors.toSet());
    }

    // ===== Business Methods - Role Management =====

    /**
     * Get all roles from all user groups
     * Demonstrates aggregation of roles from multiple groups
     * 
     * @return Set of all roles
     */
    public Set<Role> getAllRoles() {
        return this.userGroups.stream()
                .filter(UserGroup::getActive)
                .flatMap(group -> group.getRoles().stream())
                .collect(Collectors.toSet());
    }

    /**
     * Get all role names
     * Useful for API responses and authorization checks
     * 
     * @return Set of role names
     */
    public Set<String> getRoleNames() {
        return getAllRoles().stream()
                .map(role -> role.getName().name())
                .collect(Collectors.toSet());
    }

    /**
     * Check if user has a specific role
     * 
     * @param roleName The role to check
     * @return true if user has the role
     */
    public boolean hasRole(Role.RoleName roleName) {
        return getAllRoles().stream()
                .anyMatch(role -> role.getName() == roleName);
    }

    /**
     * Check if user has admin role
     * Convenience method for authorization
     * 
     * @return true if user is admin
     */
    public boolean isAdmin() {
        return hasRole(Role.RoleName.ROLE_ADMIN);
    }

    /**
     * Get Spring Security authorities
     * Converts roles to GrantedAuthority for Spring Security
     * 
     * @return Collection of authorities
     */
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getAllRoles().stream()
                .map(role -> new SimpleGrantedAuthority(role.getName().name()))
                .collect(Collectors.toSet());
    }

    // ===== Business Methods - Account Management =====

    /**
     * Enable user account
     */
    public void enable() {
        this.enabled = true;
    }

    /**
     * Disable user account
     */
    public void disable() {
        this.enabled = false;
    }

    /**
     * Lock user account
     */
    public void lock() {
        this.accountNonLocked = false;
    }

    /**
     * Unlock user account
     */
    public void unlock() {
        this.accountNonLocked = true;
        this.failedLoginAttempts = 0;
    }

    /**
     * Expire user account
     */
    public void expire() {
        this.accountNonExpired = false;
    }

    /**
     * Renew expired account
     */
    public void renew() {
        this.accountNonExpired = true;
    }

    /**
     * Expire user credentials
     */
    public void expireCredentials() {
        this.credentialsNonExpired = false;
    }

    /**
     * Renew expired credentials
     */
    public void renewCredentials() {
        this.credentialsNonExpired = true;
    }

    /**
     * Record failed login attempt
     * Auto-locks account after 5 failed attempts
     */
    public void recordFailedLogin() {
        this.failedLoginAttempts++;
        if (this.failedLoginAttempts >= 5) {
            this.lock();
        }
    }

    /**
     * Reset failed login attempts
     */
    public void resetFailedLogins() {
        this.failedLoginAttempts = 0;
    }

    /**
     * Check if account is fully active
     * All flags must be true for account to be usable
     * 
     * @return true if account can be used
     */
    public boolean isAccountActive() {
        return this.enabled && 
               this.accountNonExpired && 
               this.accountNonLocked && 
               this.credentialsNonExpired &&
               !this.getDeleted();
    }
}
