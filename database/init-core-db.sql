-- =====================================================
-- CORE DATABASE INITIALIZATION SCRIPT
-- Healthcare Management System
-- 
-- Database: core_db
-- Purpose: Business logic and healthcare data
-- 
-- Design Principles:
-- - Normalized database design
-- - Foreign key references to SSO database (via user_id)
-- - Proper indexing for queries
-- - Healthcare domain modeling
-- =====================================================

-- =====================================================
-- TABLE: patients
-- Purpose: Patient demographic and medical information
-- =====================================================
CREATE TABLE IF NOT EXISTS patients (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,  -- References users.id in SSO database
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    phone_number VARCHAR(20),
    address VARCHAR(500),
    blood_group VARCHAR(10),
    medical_history TEXT,
    allergies TEXT,
    emergency_contact_name VARCHAR(100),
    emergency_contact_phone VARCHAR(20),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_patient_user_id ON patients(user_id);
CREATE INDEX IF NOT EXISTS idx_patient_dob ON patients(date_of_birth);
CREATE INDEX IF NOT EXISTS idx_patient_blood_group ON patients(blood_group);
CREATE INDEX IF NOT EXISTS idx_patient_deleted ON patients(deleted);
CREATE INDEX IF NOT EXISTS idx_patient_name ON patients(last_name, first_name);

-- =====================================================
-- TABLE: doctors
-- Purpose: Doctor credentials and professional information
-- =====================================================
CREATE TABLE IF NOT EXISTS doctors (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    specialization VARCHAR(100),
    license_number VARCHAR(50) UNIQUE,
    qualifications VARCHAR(500),
    experience_years INTEGER NOT NULL DEFAULT 0,
    consultation_fee DECIMAL(10,2),
    available_for_consultation BOOLEAN NOT NULL DEFAULT true,
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_experience CHECK (experience_years >= 0),
    CONSTRAINT chk_fee CHECK (consultation_fee IS NULL OR consultation_fee >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_doctor_user_id ON doctors(user_id);
CREATE INDEX IF NOT EXISTS idx_doctor_specialization ON doctors(specialization);
CREATE INDEX IF NOT EXISTS idx_doctor_license ON doctors(license_number);
CREATE INDEX IF NOT EXISTS idx_doctor_available ON doctors(available_for_consultation);
CREATE INDEX IF NOT EXISTS idx_doctor_deleted ON doctors(deleted);

-- =====================================================
-- TABLE: staff
-- Purpose: General staff member information
-- =====================================================
CREATE TABLE IF NOT EXISTS staff (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    address VARCHAR(500),
    department VARCHAR(100),
    position VARCHAR(100),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_staff_user_id ON staff(user_id);
CREATE INDEX IF NOT EXISTS idx_staff_department ON staff(department);
CREATE INDEX IF NOT EXISTS idx_staff_deleted ON staff(deleted);

-- =====================================================
-- TABLE: finance_staff
-- Purpose: Finance department staff information
-- =====================================================
CREATE TABLE IF NOT EXISTS finance_staff (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    department VARCHAR(100),
    position VARCHAR(100),
    access_level INTEGER NOT NULL DEFAULT 1,
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_access_level CHECK (access_level BETWEEN 1 AND 5)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_finance_user_id ON finance_staff(user_id);
CREATE INDEX IF NOT EXISTS idx_finance_department ON finance_staff(department);
CREATE INDEX IF NOT EXISTS idx_finance_access ON finance_staff(access_level);
CREATE INDEX IF NOT EXISTS idx_finance_deleted ON finance_staff(deleted);

-- =====================================================
-- TABLE: radiologists
-- Purpose: Radiologist credentials and information
-- =====================================================
CREATE TABLE IF NOT EXISTS radiologists (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    license_number VARCHAR(50) UNIQUE,
    specialization VARCHAR(255),
    experience_years INTEGER NOT NULL DEFAULT 0,
    certification VARCHAR(255),
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT chk_rad_experience CHECK (experience_years >= 0)
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_radiologist_user_id ON radiologists(user_id);
CREATE INDEX IF NOT EXISTS idx_radiologist_license ON radiologists(license_number);
CREATE INDEX IF NOT EXISTS idx_radiologist_specialization ON radiologists(specialization);
CREATE INDEX IF NOT EXISTS idx_radiologist_deleted ON radiologists(deleted);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- Uncomment to insert sample data
-- =====================================================

-- Sample Patient (user_id 100 should exist in SSO database)
-- INSERT INTO patients (user_id, first_name, last_name, date_of_birth, gender, phone_number, blood_group) VALUES
-- (100, 'John', 'Doe', '1990-01-15', 'Male', '+1234567890', 'O+');

-- Sample Doctor (user_id 101 should exist in SSO database)
-- INSERT INTO doctors (user_id, first_name, last_name, specialization, license_number, experience_years) VALUES
-- (101, 'Sarah', 'Smith', 'Cardiology', 'MD123456', 10);

-- Sample Staff (user_id 102 should exist in SSO database)
-- INSERT INTO staff (user_id, first_name, last_name, department, position) VALUES
-- (102, 'Alice', 'Johnson', 'Administration', 'Receptionist');

-- Sample Finance Staff (user_id 103 should exist in SSO database)
-- INSERT INTO finance_staff (user_id, first_name, last_name, department, position, access_level) VALUES
-- (103, 'Michael', 'Brown', 'Finance', 'Accountant', 2);

-- Sample Radiologist (user_id 104 should exist in SSO database)
-- INSERT INTO radiologists (user_id, first_name, last_name, license_number, specialization, experience_years) VALUES
-- (104, 'Emily', 'Davis', 'RAD789012', 'MRI Specialist', 8);
-- =====================================================
-- STATISTICS QUERIES (Useful for reporting)
-- =====================================================

-- Function to get patient count
CREATE OR REPLACE FUNCTION get_patient_count() 
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM patients WHERE deleted = false);
END;
$$ LANGUAGE plpgsql;

-- Function to get doctor count by specialization
CREATE OR REPLACE FUNCTION get_doctor_count_by_specialization(spec VARCHAR) 
RETURNS INTEGER AS $$
BEGIN
    RETURN (SELECT COUNT(*) FROM doctors 
            WHERE specialization = spec AND deleted = false);
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- RESET SEQUENCES
-- =====================================================
SELECT setval('patients_id_seq', (SELECT COALESCE(MAX(id), 0) FROM patients) + 1);
SELECT setval('doctors_id_seq', (SELECT COALESCE(MAX(id), 0) FROM doctors) + 1);
SELECT setval('staff_id_seq', (SELECT COALESCE(MAX(id), 0) FROM staff) + 1);
SELECT setval('finance_staff_id_seq', (SELECT COALESCE(MAX(id), 0) FROM finance_staff) + 1);
SELECT setval('radiologists_id_seq', (SELECT COALESCE(MAX(id), 0) FROM radiologists) + 1);

-- =====================================================
-- DATABASE NOTES
-- =====================================================
-- 1. user_id references users.id in SSO database (not enforced by FK due to separate DB)
-- 2. Core service must validate user_id exists before insertion
-- 3. All tables include soft delete (deleted flag)
-- 4. Indexes optimized for common queries
-- 5. Constraints ensure data validity
-- 6. Views provide convenient access patterns
-- 7. Timestamps are in UTC
-- 8. Functions provided for common statistics
-- =====================================================
