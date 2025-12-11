package com.healthcare.core.service;

import com.healthcare.common.dto.ServiceCatalogDTO;
import com.healthcare.common.entity.ServiceCatalog;
import com.healthcare.common.service.ServiceCatalogService;
import com.healthcare.core.repository.ServiceCatalogRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ServiceCatalogServiceImpl implements ServiceCatalogService {
    private final ServiceCatalogRepository serviceCatalogRepository;

    public ServiceCatalogServiceImpl(ServiceCatalogRepository serviceCatalogRepository) {
        this.serviceCatalogRepository = serviceCatalogRepository;
    }

    @Override
    public List<ServiceCatalogDTO> getAllServiceCatalogs() {
        List<ServiceCatalog> serviceCatalogs = serviceCatalogRepository.findAll();
        return serviceCatalogs.stream()
                .map(sc -> new ServiceCatalogDTO(
                        sc.getId(),
                        sc.getServiceCode(),
                        sc.getDescription(),
                        sc.getUnitCost()
                ))
                .collect(Collectors.toList());
    }
}
