package com.healthcare.core.service;

import com.healthcare.common.dto.AppointmentCreateRequestDTO;
import com.healthcare.common.dto.AppointmentServiceDTO;
import com.healthcare.common.dto.ServiceCatalogDTO;
import com.healthcare.common.enmus.PaymentStatus;
import com.healthcare.common.enmus.TaskStatus;
import com.healthcare.common.entity.*;
import com.healthcare.common.service.AppointmentService;
import com.healthcare.common.service.ServiceCatalogService;
import com.healthcare.core.exception.ResourceNotFoundException;
import com.healthcare.core.repository.*;
import com.healthcare.core.util.UniqueCodeGenerator;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Slf4j
@AllArgsConstructor
public class AppointmentServiceImpl implements AppointmentService {

    private final PatientRepository patientRepository;
    private final StaffRepository staffRepository;
    private final VisitRepository visitRepository;
    private final InvoiceRepository invoiceRepository;
    private final ServiceCatalogRepository serviceCatalogRepository;
    private final MedicalImageRepository medicalImageRepository;
    private final WorkflowTaskRepository workflowTaskRepository;
    private final BillItemRepository billItemRepository;

    @Override
    @Transactional(
            propagation = Propagation.REQUIRED,
            isolation = Isolation.READ_COMMITTED,
            rollbackFor = Exception.class
    )
    public Object createAppointment(AppointmentCreateRequestDTO requestDTO) {
        log.info("Starting appointment workflow creation for patient ID: {}", requestDTO.getPatientId());

        try {
            // Step 1: Validate and fetch required entities
            Patient patient = validateAndFetchPatient(requestDTO.getPatientId());

            Staff doctor = null;
            if (requestDTO.getDoctorId() != null) {
                doctor = validateAndFetchDoctor(requestDTO.getDoctorId());
            }

            // Step 2: Create and save Visit
            Visit visit = createVisit(requestDTO, patient, doctor);
            Visit savedVisit = visitRepository.save(visit);
            log.info("Visit created with visitNo: {}", savedVisit.getVisitNo());

            // Step 3: Create and save Invoice (linked to visit)
            Invoice invoice = createInvoice(savedVisit);
            Invoice savedInvoice = invoiceRepository.save(invoice);
            log.info("Invoice created with invoiceNo: {}", savedInvoice.getInvoiceNO());

            // Step 4: Create WorkflowTask, BillItem, and MedicalImage for each service
            List<WorkflowTask> tasks = new ArrayList<>();
            List<BillItem> billItems = new ArrayList<>();
            List<MedicalImage> medicalImages = new ArrayList<>();
            BigDecimal totalAmount = BigDecimal.ZERO;

            for (AppointmentServiceDTO serviceDTO : requestDTO.getServices()) {
                // Fetch service catalog
                ServiceCatalog serviceCatalog = validateAndFetchServiceCatalog(serviceDTO.getServiceId());

                // Create MedicalImage entry first (just a placeholder entry)
                MedicalImage medicalImage = createMedicalImageEntry(patient, doctor);
                MedicalImage savedImage = medicalImageRepository.save(medicalImage);
                medicalImages.add(savedImage);
                log.info("MedicalImage entry created with ID: {}", savedImage.getId());

                // Create WorkflowTask and link it to the medical image
                WorkflowTask task = createWorkflowTask(savedVisit, serviceDTO, serviceCatalog, doctor, savedImage);
                WorkflowTask savedTask = workflowTaskRepository.save(task);
                tasks.add(savedTask);
                log.info("WorkflowTask created with taskNo: {}", savedTask.getTaskNo());

                // Create BillItem (linked to invoice and task)
                BillItem billItem = createBillItem(savedInvoice, serviceCatalog, savedTask);
                BillItem savedBillItem = billItemRepository.save(billItem);
                billItems.add(savedBillItem);
                log.info("BillItem created for service: {} with amount: {}",
                        serviceCatalog.getServiceCode(), billItem.getChargedAmount());

                // Accumulate total amount
                totalAmount = totalAmount.add(serviceCatalog.getUnitCost());
            }

            // Step 5: Update Invoice with total amount and bill items
            savedInvoice.setTotalAmount(totalAmount);
            savedInvoice.setBillItems(billItems);
            invoiceRepository.save(savedInvoice);
            log.info("Invoice updated with total amount: {}", totalAmount);

            // Step 6: Update Visit with invoice and tasks
            savedVisit.setInvoice(savedInvoice);
            savedVisit.setTasks(tasks);
            Visit finalVisit = visitRepository.save(savedVisit);

            log.info("Appointment workflow created successfully. Visit ID: {}, Invoice ID: {}, Tasks: {}, Images: {}",
                    finalVisit.getId(), savedInvoice.getId(), tasks.size(), medicalImages.size());

            return finalVisit;

        } catch (ResourceNotFoundException e) {
            log.error("Resource not found during workflow creation: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            log.error("Error creating appointment workflow: {}", e.getMessage(), e);
            throw new RuntimeException("Failed to create appointment workflow: " + e.getMessage(), e);
        }
    }

    private Patient validateAndFetchPatient(Long patientId) {
        return patientRepository.findById(patientId)
                .filter(patient -> !patient.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient not found with ID: " + patientId));
    }

    private Staff validateAndFetchDoctor(Long doctorId) {
        if (doctorId == null) {
            return null; // Doctor is optional for some visits
        }
        return staffRepository.findById(doctorId)
                .filter(staff -> !staff.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Doctor not found with ID: " + doctorId));
    }

    private Visit createVisit(AppointmentCreateRequestDTO requestDTO, Patient patient, Staff doctor) {
        return Visit.builder()
                .visitNo(generateVisitNumber())
                .patient(patient)
                .doctor(doctor)
                .deleted(false)
                .visitReason(requestDTO.getNotes())
                .checkInTime(LocalDateTime.of(requestDTO.getDate(), requestDTO.getTime()))
                .build();
    }

    private WorkflowTask createWorkflowTask(Visit visit, AppointmentServiceDTO serviceDTO,
                                            ServiceCatalog serviceCatalog, Staff assignedStaff,
                                            MedicalImage medicalImage) {
        return WorkflowTask.builder()
                .taskNo(generateTaskNumber())
                .visit(visit)
                .medicalImage(medicalImage)
                .assignedStaff(assignedStaff)
                .taskType(TaskStatus.PENDING)
                .status(TaskStatus.PENDING)
                .deleted(false)
                .description(serviceDTO.getClinicNote() != null ?
                        serviceDTO.getClinicNote() : serviceCatalog.getDescription())
                .createdOn(LocalDateTime.now())
                .build();
    }

    private MedicalImage createMedicalImageEntry(Patient patient, Staff uploadedBy) {
        return MedicalImage.builder()
                .patient(patient)
                .modality("PENDING") // Will be updated when actual scan is done
                .deleted(false)
                .build();
    }

    private BillItem createBillItem(Invoice invoice, ServiceCatalog serviceCatalog, WorkflowTask task) {
        return BillItem.builder()
                .invoice(invoice)
                .serviceCatalog(serviceCatalog)
                .sourceTask(task)
                .deleted(false)
                .chargedAmount(serviceCatalog.getUnitCost()) // Snapshot of price at billing time
                .build();
    }

    private Invoice createInvoice(Visit visit) {
        return Invoice.builder()
                .invoiceNO(generateInvoiceNumber())
                .visit(visit)
                .deleted(false)
                .totalAmount(BigDecimal.ZERO) // Will be updated after calculating all bill items
                .status(PaymentStatus.OPEN)
                .billItems(new ArrayList<>())
                .build();
    }

    private String generateVisitNumber() {
        return "V_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private String generateInvoiceNumber() {
        return "INV_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

    private ServiceCatalog validateAndFetchServiceCatalog(Long serviceId) {
        return serviceCatalogRepository.findById(serviceId)
                .filter(service -> !service.getDeleted())
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Service not found with ID: " + serviceId));
    }

    private String generateTaskNumber() {
        return "TASK_" + System.currentTimeMillis() + "_" +
                UUID.randomUUID().toString().substring(0, 6).toUpperCase();
    }

}
