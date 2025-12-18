package com.healthcare.common.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceDTO {
    private Long id;
    private String invoiceNumber;
    private String patientId;
    private String patientName;
    private String appointmentId;
    private LocalDate date;
    private List<InvoiceItemDTO> items;
    private BigDecimal subtotal;
    private BigDecimal tax;
    private BigDecimal total;
    private String status; // Could also be an Enum: PENDING, PAID, CANCELLED
    private LocalDate dueDate;

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class InvoiceItemDTO {
        private String code;
        private String description;
        private BigDecimal amount;
    }
}
