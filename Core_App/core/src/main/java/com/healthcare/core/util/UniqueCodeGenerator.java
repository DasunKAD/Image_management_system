package com.healthcare.core.util;

import com.healthcare.common.entity.UniqueCode;
import com.healthcare.core.repository.UniqueCodeRepository;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;

@Service
public class UniqueCodeGenerator {
    private  final UniqueCodeRepository uniqueKeyRepository;

    private static final SecureRandom random = new SecureRandom();

    public UniqueCodeGenerator(UniqueCodeRepository uniqueKeyRepository) {
        this.uniqueKeyRepository = uniqueKeyRepository;
    }

    public String generateUniqueCode() {
        String code;
        do {
            int number = random.nextInt(99999999); // 8 digits max
            code = String.format("%08d", number); // P00000001 format
        } while (uniqueKeyRepository.existsByUniqueCode(code));

        UniqueCode uniqueKey = new UniqueCode();
        uniqueKey.setUniqueCode(code);
        uniqueKey.setDeleted(false);
        uniqueKeyRepository.save(uniqueKey);
        return code;
    }
}
