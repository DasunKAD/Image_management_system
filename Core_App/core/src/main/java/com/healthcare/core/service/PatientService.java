package com.healthcare.core.service;

import com.healthcare.common.dto.*;
import com.healthcare.common.entity.*;
import com.healthcare.core.repository.DiagnosticReportRepository;
import com.healthcare.core.repository.PatientRepository;
import com.healthcare.core.repository.VisitRepository;
import com.healthcare.core.repository.WorkflowTaskRepository;
import com.healthcare.core.util.S3Service;
import com.healthcare.core.util.UniqueCodeGenerator;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class PatientService {

    private final PatientRepository patientRepository;
    private final SsoClient ssoClient;
    private final UniqueCodeGenerator codeGenerator;
    private final VisitRepository visitRepository;
    private final S3Service s3Service;
    private final DiagnosticReportRepository diagnosticReportRepository;

    @Transactional
    public Patient registerPatient(PatientRegistrationRequest request) {
        // Create user in SSO with PATIENT group
        UserResponse ssoUser = ssoClient.createUserInSso(
                request.getUsername(),
                request.getEmail(),
                request.getPassword(),
                Set.of("PATIENTS")
        );

        // Create patient record in Core DB
        Patient patient = Patient.builder()
                .userId(ssoUser.getId())
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .dateOfBirth(request.getDateOfBirth())
                .gender(request.getGender())
                .phoneNumber(request.getPhoneNumber())
                .address(request.getAddress())
                .bloodGroup(request.getBloodGroup())
                .deleted(false)
                .medicalHistory(request.getMedicalHistory())
                .allergies(request.getAllergies())
                .build();

        patient.setPatientCode("P"+ codeGenerator.generateUniqueCode());

        return patientRepository.save(patient);
    }

    @Transactional(readOnly = true)
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @Transactional(readOnly = true)
    public List<Patient> searchPatients(String term) {
        return patientRepository.searchPatients(term);
    }

    @Transactional(readOnly = true)
    public Patient getPatientById(Long id) {
        return patientRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + id));
    }

    @Transactional(readOnly = true)
    public PatientDTO getPatientWithFullDetails(Long userId) {
        // 1. Fetch Basic Patient Details
        Patient patient = patientRepository.findByUserId(userId)
                .orElseThrow(() -> new RuntimeException("Patient not found with id: " + userId));

        // 2. Fetch Visits (with Tasks and Images eagerly loaded)
        List<Visit> visits = visitRepository.findAllByPatientIdWithDetails(patient.getId());

        // 3. COLLECT IMAGE IDs from all tasks to fetch reports in one batch
        List<Long> imageIds = visits.stream()
                .filter(v -> v.getTasks() != null)
                .flatMap(v -> v.getTasks().stream())
                .map(WorkflowTask::getMedicalImage)
                .filter(Objects::nonNull)
                .map(MedicalImage::getId)
                .collect(Collectors.toList());

        // 4. FETCH DIAGNOSTIC REPORTS in bulk
        Map<Long, DiagnosticReport> reportMap = Collections.emptyMap();
        if (!imageIds.isEmpty()) {
            List<DiagnosticReport> reports = diagnosticReportRepository.findByMedicalImageIdIn(imageIds);
            // Create a Map: ImageID -> DiagnosticReport
            reportMap = reports.stream()
                    .collect(Collectors.toMap(
                            r -> r.getMedicalImage().getId(),
                            Function.identity(),
                            (existing, replacement) -> existing // Handle potential duplicates safely
                    ));
        }

        // 5. Map to DTO
        PatientDTO patientDTO = mapToPatientDTO(patient);

        // Map Invoices
        List<InvoiceDTO> invoices = visits.stream()
                .filter(visit -> visit.getInvoice() != null)
                .map(visit -> mapToInvoiceDTO(visit.getInvoice()))
                .collect(Collectors.toList());
        patientDTO.setInvoices(invoices);

        // Map Tasks & Link Reports from the Map
        Map<Long, DiagnosticReport> finalReportMap = reportMap; // variable for lambda
        List<WorkflowTaskDetailsDTO> tasks = visits.stream()
                .filter(visit -> visit.getTasks() != null)
                .flatMap(visit -> visit.getTasks().stream())
                .map(task -> mapToTaskDetailsDTO(task, finalReportMap)) // Pass map here
                .collect(Collectors.toList());
        patientDTO.setTasks(tasks);

        return patientDTO;
    }

    @Transactional
    public void deletePatient(Long id) {
        patientRepository.deleteById(id);
    }


    private PatientDTO mapToPatientDTO(Patient patient) {
        return PatientDTO.builder()
                .id(patient.getId())
                .userId(patient.getUserId())
                .firstName(patient.getFirstName())
                .lastName(patient.getLastName())
                .fullName(patient.getFullName())
                .patientCode(patient.getPatientCode())
                .dateOfBirth(patient.getDateOfBirth())
                .age(patient.getAge())
                .gender(patient.getGender())
                .phoneNumber(patient.getPhoneNumber())
                .address(patient.getAddress())
                .email(patient.getEmail())
                .bloodGroup(patient.getBloodGroup())
                .medicalHistory(patient.getMedicalHistory())
                .allergies(patient.getAllergies())
                .emergencyContactName(patient.getEmergencyContactName())
                .emergencyContactPhone(patient.getEmergencyContactPhone())
                .ageCategory(patient.getAgeCategory())
                .minor(patient.isMinor())
                .senior(patient.isSenior())
                .hasAllergies(patient.hasAllergies())
                .hasEmergencyContact(patient.hasEmergencyContact())
                .build();
    }

    private InvoiceDTO mapToInvoiceDTO(Invoice invoice) {
        InvoiceDTO dto = new InvoiceDTO();
        dto.setId(invoice.getId());
        dto.setInvoiceNumber(invoice.getInvoiceNO());
        dto.setStatus(invoice.getStatus().name());
        dto.setDate(invoice.getCreatedAt().toLocalDate());

        // Map Bill Items if present
        if (invoice.getBillItems() != null) {
            List<InvoiceDTO.InvoiceItemDTO> items = invoice.getBillItems().stream()
                    .map(item -> new InvoiceDTO.InvoiceItemDTO(
                            item.getServiceCatalog().getServiceCode(),
                            item.getServiceCatalog().getDescription(),
                            item.getChargedAmount()
                    ))
                    .collect(Collectors.toList());
            dto.setItems(items);

            // Calculate totals from items just to be safe/consistent
            BigDecimal total = items.stream()
                    .map(InvoiceDTO.InvoiceItemDTO::getAmount)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            dto.setTotal(total);
            dto.setSubtotal(total); // Assuming no tax logic for now
        }

        return dto;
    }

    private WorkflowTaskDetailsDTO mapToTaskDetailsDTO(WorkflowTask task, Map<Long, DiagnosticReport> reportMap) {
        WorkflowTaskDetailsDTO.WorkflowTaskDetailsDTOBuilder builder = WorkflowTaskDetailsDTO.builder()
                .taskId(task.getId())
                .taskNo(task.getTaskNo())
                .status(task.getStatus().name())
                .description(task.getDescription())
                .createdOn(task.getCreatedOn())
                .completedOn(task.getCompletedOn());

        // Map Image Data & Diagnostic Report
        if (task.getMedicalImage() != null) {
            builder.modality(task.getMedicalImage().getModality());
            builder.uploadDate(task.getMedicalImage().getUploadDate());

            // S3 URLs
            if (task.getMedicalImage().getFileUrls() != null) {
                List<String> presignedUrls = task.getMedicalImage().getFileUrls().stream()
                        .map(s3Service::getPresignedUrl)
                        .collect(Collectors.toList());
                builder.images(presignedUrls);
            }

            // LINK REPORT: Check if we found a report for this image ID
            DiagnosticReport report = reportMap.get(task.getMedicalImage().getId());
            if (report != null) {
                builder.diagnosticReport(DiagnosticReportDTO.builder()
                        .taskId(task.getId()) // Contextual ID
                        .patientId(task.getVisit().getPatient().getId())
                        .visitId(task.getVisit().getId())
                        .diseaseClassification(report.getDiseaseClassification())
                        .findings(report.getFindings())
                        .build());
            }
        }

        // Map Visit Context
        if (task.getVisit() != null) {
            builder.visitId(task.getVisit().getId());
            builder.visitReason(task.getVisit().getVisitReason());
            if (task.getVisit().getDoctor() != null) {
                builder.visitDoctorName(task.getVisit().getDoctor().getFirstName() + " " +
                        task.getVisit().getDoctor().getLastName());
            }
        }

        return builder.build();
    }
}
