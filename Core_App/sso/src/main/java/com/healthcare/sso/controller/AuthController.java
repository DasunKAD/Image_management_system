package com.healthcare.sso.controller;

import com.healthcare.common.dto.*;
import com.healthcare.sso.service.AuthService;
import io.jsonwebtoken.Claims;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

//    @PostMapping("/validate")
//    public ResponseEntity<TokenValidationResponse> validateToken(@Valid @RequestBody TokenValidationRequest request) {
//        return ResponseEntity.ok(authService.validateToken(request));
//    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader("Authorization") String authorizationHeader) {
        String token = null;
        if (StringUtils.hasText(authorizationHeader) && authorizationHeader.startsWith("Bearer ")) {
            token = authorizationHeader.substring(7);
        } else {
            return ResponseEntity.badRequest().body(Map.of("error", "Authorization header is missing or not Bearer type"));
        }

        try {
            TokenValidationResponse tokenValidationResponse = authService.validateToken(token);
            return ResponseEntity.ok(tokenValidationResponse);
        } catch (Exception e) {
            return ResponseEntity.status(401).body(Map.of("error", "Token validation failed", "details", e.getMessage()));
        }
    }
}
