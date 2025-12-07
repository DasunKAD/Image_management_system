package com.healthcare.sso.service;

import com.healthcare.common.entity.User;

public interface TokenService {

    /**
     * Generate JWT token for user
     */
    String generateToken(User user);

    /**
     * Validate JWT token
     */
    boolean validateToken(String token);

    /**
     * Extract username from token
     */
    String getUsernameFromToken(String token);

    /**
     * Check if token is expired
     */
    boolean isTokenExpired(String token);

    /**
     * Generate refresh token
     */
    String generateRefreshToken(User user);
}
