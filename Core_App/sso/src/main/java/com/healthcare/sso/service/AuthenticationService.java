package com.healthcare.sso.service;

import com.healthcare.common.dto.*;
import com.healthcare.common.entity.User;

import java.util.Optional;

public interface AuthenticationService {

    /**
     * Authenticate user and generate JWT token
     *
     * @param request Login credentials
     * @return Login response with token
     * @throws AuthenticationException if credentials are invalid
     */
    LoginResponse login(LoginRequest request);

    /**
     * Validate JWT token
     *
     * @param request Token validation request
     * @return Validation result
     */
    TokenValidationResponse validateToken(TokenValidationRequest request);

    /**
     * Create new user in SSO system
     * Called by Core service during registration
     *
     * @param request User creation request
     * @return Created user response
     * @throws UserAlreadyExistsException if username/email exists
     */
    UserResponse createUser(CreateUserRequest request);

    /**
     * Get user by username
     *
     * @param username Username to find
     * @return User if found
     */
    Optional<User> getUserByUsername(String username);

    /**
     * Lock user account after failed login attempts
     *
     * @param username Username to lock
     */
    void lockUserAccount(String username);

    /**
     * Unlock user account
     *
     * @param username Username to unlock
     */
    void unlockUserAccount(String username);
}
