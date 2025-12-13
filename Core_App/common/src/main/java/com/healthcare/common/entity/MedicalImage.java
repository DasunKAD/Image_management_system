package com.healthcare.common.entity;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "medical_image")
@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@EqualsAndHashCode(callSuper = true, onlyExplicitlyIncluded = true)
public class MedicalImage extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "patient_id", nullable = false)
    private Patient patient;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "uploaded_by_staff_id")
    private Staff uploadedBy;

    // Store multiple file URLs
    @ElementCollection
    @CollectionTable(
            name = "medical_image_files",
            joinColumns = @JoinColumn(name = "medical_image_id")
    )
    @Column(name = "file_url")
    @Builder.Default
    private List<String> fileUrls = new ArrayList<>();

    private String modality; // "MRI", "CT", "XRAY"

    private LocalDateTime uploadDate;

    public void addFileUrl(String fileUrl) {
        if (fileUrl != null && !fileUrl.trim().isEmpty()) {
            this.fileUrls.add(fileUrl);
        }
    }
}
