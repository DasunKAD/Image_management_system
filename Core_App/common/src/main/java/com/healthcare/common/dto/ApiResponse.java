package com.healthcare.common.dto;

import java.time.LocalDateTime;

public class ApiResponse<T> {

    private String status;
    private String message;
    private T data;
    private LocalDateTime timestamp = LocalDateTime.now();

    public ApiResponse(String status, String message, T data) {
        this.status = status;
        this.message = message;
        this.data = data;
    }
}

