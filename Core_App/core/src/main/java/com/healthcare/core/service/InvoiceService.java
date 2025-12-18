package com.healthcare.core.service;

import com.healthcare.common.dto.FinanceRegistrationRequest;
import com.healthcare.common.dto.InvoiceDTO;
import com.healthcare.common.dto.UserResponse;
import com.healthcare.common.enmus.PaymentStatus;
import com.healthcare.common.entity.BillItem;
import com.healthcare.common.entity.FinanceStaff;
import com.healthcare.common.entity.Invoice;
import com.healthcare.core.repository.FinanceStaffRepository;
import com.healthcare.core.repository.InvoiceRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.validation.constraints.NotNull;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class InvoiceService {
    private final InvoiceRepository invoiceRepository;

    public List<InvoiceDTO> getAllInvoices() {
        return invoiceRepository.findAll().stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    private InvoiceDTO mapToDTO(Invoice invoice) {
        InvoiceDTO invoiceDto = new InvoiceDTO();
        invoiceDto.setId(invoice.getId());
        invoiceDto.setInvoiceNumber(invoice.getInvoiceNO());
        invoiceDto.setStatus(invoice.getStatus().toString());
        invoiceDto.setDate(invoice.getCreatedAt().toLocalDate());
        invoiceDto.setTax(BigDecimal.ZERO);
        invoiceDto.setItems(invoice.getBillItems().stream()
                        .map(this::mapToItemDto)
                                .collect(Collectors.toList()));
        invoiceDto.setSubtotal(BigDecimal.ZERO);
        invoiceDto.setAppointmentId(invoice.getVisit().getVisitNo());
        invoiceDto.setPatientName(invoice.getVisit().getPatient().getFullName());
        invoiceDto.setPatientId(invoice.getVisit().getPatient().getPatientCode());
        invoiceDto.setTotal(invoiceDto.getItems().stream()
                .map(InvoiceDTO.InvoiceItemDTO::getAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add));
        invoiceDto.setSubtotal(invoiceDto.getTotal());

        return invoiceDto;
    }

    private InvoiceDTO.InvoiceItemDTO mapToItemDto(BillItem billItem) {
        InvoiceDTO.InvoiceItemDTO itemDto = new InvoiceDTO.InvoiceItemDTO();
        itemDto.setDescription(billItem.getServiceCatalog().getDescription());
        itemDto.setCode(billItem.getServiceCatalog().getServiceCode());
        itemDto.setAmount(billItem.getServiceCatalog().getUnitCost());
        return itemDto;
    }

    public void updateStatus(Long id, @NotNull PaymentStatus status) {
        Invoice invoice = invoiceRepository.findById(id).orElseThrow();
        invoice.setStatus(status);
        invoice.getVisit().setCheckOutTime(LocalDateTime.now());
        invoiceRepository.save(invoice);
    }
}
