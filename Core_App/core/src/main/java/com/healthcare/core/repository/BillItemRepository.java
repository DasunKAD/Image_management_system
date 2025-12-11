package com.healthcare.core.repository;

import com.healthcare.common.entity.BillItem;
import com.healthcare.common.entity.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BillItemRepository extends JpaRepository<BillItem, Long> {
}
