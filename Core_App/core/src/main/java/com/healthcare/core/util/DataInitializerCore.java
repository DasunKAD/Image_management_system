package com.healthcare.core.util;

import com.healthcare.common.dto.CreateUserRequest;
import com.healthcare.common.entity.ServiceCatalog;
import com.healthcare.common.service.ServiceCatalogService;
import com.healthcare.core.repository.ServiceCatalogRepository;
import jakarta.annotation.PostConstruct;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Component
@AllArgsConstructor
public class DataInitializerCore {

    @Autowired
    private final ServiceCatalogRepository serviceCatalogService; // Your JPA repository

    @PostConstruct
    public void init() {
        List<ServiceCatalog> services = new ArrayList<>();

        // 1. PROFESSIONAL SERVICES
        services.add(create("SVC_CON_GEN", "General Doctor Consultation", 50.00));
        services.add(create("SVC_CON_SPE", "Specialist Consultation (Senior)", 150.00));
        services.add(create("SVC_CON_EMG", "Emergency Consultation", 120.00));
        services.add(create("SVC_REP_RAD", "Radiologist Reporting Fee", 50.00));
        services.add(create("SVC_CON_FOL", "Follow-up Visit (Short)", 30.00));

        // 2. IMAGING SERVICES (MRI)
        services.add(create("SVC_MRI_HEAD", "MRI Scan - Head/Brain", 500.00));
        services.add(create("SVC_MRI_SPINE", "MRI Scan - Spine", 550.00));
        services.add(create("SVC_MRI_KNEE", "MRI Scan - Knee/Joint", 450.00));
        services.add(create("SVC_MRI_BODY", "MRI Scan - Full Body", 800.00));

        // 3. IMAGING SERVICES (CT Scan)
        services.add(create("SVC_CT_HEAD", "CT Scan - Head", 300.00));
        services.add(create("SVC_CT_CHEST", "CT Scan - Chest/Lungs", 320.00));
        services.add(create("SVC_CT_ABD", "CT Scan - Abdomen", 350.00));
        services.add(create("SVC_CT_CONT", "CT Scan with Contrast", 400.00));

        // 4. IMAGING SERVICES (X-Ray & Ultrasound)
        services.add(create("SVC_XR_CHEST", "X-Ray - Chest", 80.00));
        services.add(create("SVC_XR_LIMB", "X-Ray - Limb (Arm/Leg)", 70.00));
        services.add(create("SVC_US_GEN", "Ultrasound - General", 120.00));
        services.add(create("SVC_US_PREG", "Ultrasound - Pregnancy/Baby", 150.00));

        // 5. DIAGNOSTIC & LAB SERVICES
        services.add(create("SVC_DG_ECG", "Electrocardiogram (ECG)", 100.00));
        services.add(create("SVC_LAB_BLD", "Full Blood Count (FBC)", 45.00));
        services.add(create("SVC_LAB_LIP", "Lipid Profile / Cholesterol", 60.00));
        services.add(create("SVC_LAB_URI", "Urinalysis", 25.00));

        // 6. ADMINISTRATIVE & CHANNELING FEES
        services.add(create("SVC_ADM_REG", "New Patient Registration", 15.00));
        services.add(create("SVC_ADM_PRT", "Medical Records Printout", 10.00));
        services.add(create("SVC_ADM_REF", "External Referral Processing", 20.00));
        services.add(create("SVC_CHAN_FEE", "Channeling Center Fee (Hospital Charge)", 15.00));
        services.add(create("SVC_BOOK_FEE", "Online Booking Surcharge", 5.00));

        services.forEach(data -> {
            try {
                serviceCatalogService.save(data);
            } catch (Exception e) {
                System.out.println("Skipping error: " + data.getDescription() + " => " + e.getMessage());
            }
        });


    }

    // Helper method to keep code clean
    private static ServiceCatalog create(String code, String desc, double cost) {
        ServiceCatalog svc = new ServiceCatalog();
        svc.setServiceCode(code);
        svc.setDescription(desc);
        svc.setDeleted(false);
        svc.setUnitCost(BigDecimal.valueOf(cost));
        return svc;
    }
}

