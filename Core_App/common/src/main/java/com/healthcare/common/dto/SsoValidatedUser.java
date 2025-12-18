package com.healthcare.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.lang.reflect.Array;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SsoValidatedUser {
    private String message;
    private String username;
    private String email;
    private Long userId;
    private List<String> roles;
    private Boolean valid;
}
