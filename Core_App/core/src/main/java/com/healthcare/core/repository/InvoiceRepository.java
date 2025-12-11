package com.healthcare.core.repository;

import com.healthcare.common.entity.Invoice;
import com.healthcare.common.entity.Visit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
}
