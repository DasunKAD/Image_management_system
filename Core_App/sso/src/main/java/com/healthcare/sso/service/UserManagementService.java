package com.healthcare.sso.service;

import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.entity.User;

import java.util.Optional;

public interface UserManagementService {

    /**
     * Find user by ID
     */
    Optional<User> findById(Long id);

    /**
     * Find user by email
     */
    Optional<User> findByEmail(String email);

    /**
     * Update user details
     */
    User updateUser(Long id, UserResponse userUpdate);

    /**
     * Disable user account
     */
    void disableUser(Long id);

    /**
     * Enable user account
     */
    void enableUser(Long id);
}