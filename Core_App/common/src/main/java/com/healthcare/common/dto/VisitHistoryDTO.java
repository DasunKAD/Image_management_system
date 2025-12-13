package com.healthcare.common.dto;

import java.time.LocalDateTime;

public class VisitHistoryDTO {
    private LocalDateTime date;     // e.g., 2024-12-11
    private String type;     // Specialist / General
    private String reason;
    private String doctor;
}
