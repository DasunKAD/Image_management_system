package com.healthcare.common.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;
import java.util.Set;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TokenValidationResponse {

    private Boolean valid;
    private String username;
    private String message;
    private Long userId;
    private String email;
    private Set<String> roles;
}