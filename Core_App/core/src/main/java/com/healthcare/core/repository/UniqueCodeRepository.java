package com.healthcare.core.repository;

import com.healthcare.common.entity.UniqueCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UniqueCodeRepository extends JpaRepository<UniqueCode, Long> {
    Boolean existsByUniqueCode(String code);
}
