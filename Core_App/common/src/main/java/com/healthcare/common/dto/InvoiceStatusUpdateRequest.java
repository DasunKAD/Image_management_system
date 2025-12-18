package com.healthcare.common.dto;

import com.healthcare.common.enmus.PaymentStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class InvoiceStatusUpdateRequest {

    @NotNull
    private PaymentStatus status;
}
