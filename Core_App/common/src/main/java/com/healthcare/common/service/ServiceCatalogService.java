package com.healthcare.common.service;

import com.healthcare.common.dto.ServiceCatalogDTO;

import java.util.List;

public interface ServiceCatalogService {
    List<ServiceCatalogDTO> getAllServiceCatalogs();
}
