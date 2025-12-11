-- =====================================================
-- SSO DATABASE INITIALIZATION SCRIPT
-- Healthcare Management System
-- 
-- Database: sso_db
-- Purpose: Authentication and Authorization
-- 
-- Design Principles Demonstrated:
-- - Normalized database design (3NF)
-- - Proper indexing for performance
-- - Foreign key constraints for data integrity
-- - Default values for consistency
-- - Many-to-many relationships
-- =====================================================

-- =====================================================
-- TABLE: roles
-- Purpose: System roles for access control
-- Design: Enum-based roles for type safety
-- =====================================================
CREATE TABLE IF NOT EXISTS roles (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_role_name ON roles(name);
CREATE INDEX IF NOT EXISTS idx_role_active ON roles(active);

-- =====================================================
-- TABLE: user_groups
-- Purpose: Organizational units for role aggregation
-- Design: Groups can have multiple roles
-- =====================================================
CREATE TABLE IF NOT EXISTS user_groups (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description VARCHAR(500),
    active BOOLEAN NOT NULL DEFAULT true,
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_group_name ON user_groups(name);
CREATE INDEX IF NOT EXISTS idx_group_active ON user_groups(active);

-- =====================================================
-- TABLE: users
-- Purpose: User authentication and account management
-- Design: Comprehensive security fields
-- =====================================================
CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    enabled BOOLEAN NOT NULL DEFAULT true,
    account_non_expired BOOLEAN NOT NULL DEFAULT true,
    account_non_locked BOOLEAN NOT NULL DEFAULT true,
    credentials_non_expired BOOLEAN NOT NULL DEFAULT true,
    failed_login_attempts INTEGER NOT NULL DEFAULT 0,
    deleted BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_username ON users(username);
CREATE INDEX IF NOT EXISTS idx_user_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_user_enabled ON users(enabled);
CREATE INDEX IF NOT EXISTS idx_user_deleted ON users(deleted);

-- =====================================================
-- TABLE: user_group_roles
-- Purpose: Many-to-many relationship between groups and roles
-- Design: Junction table with composite primary key
-- =====================================================
CREATE TABLE IF NOT EXISTS user_group_roles (
    user_group_id BIGINT NOT NULL,
    role_id BIGINT NOT NULL,
    PRIMARY KEY (user_group_id, role_id),
    FOREIGN KEY (user_group_id) REFERENCES user_groups(id) ON DELETE CASCADE,
    FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE
);

-- Create indexes for join performance
CREATE INDEX IF NOT EXISTS idx_ugr_group ON user_group_roles(user_group_id);
CREATE INDEX IF NOT EXISTS idx_ugr_role ON user_group_roles(role_id);

-- =====================================================
-- TABLE: user_user_groups
-- Purpose: Many-to-many relationship between users and groups
-- Design: Junction table for user group membership
-- =====================================================
CREATE TABLE IF NOT EXISTS user_user_groups (
    user_id BIGINT NOT NULL,
    user_group_id BIGINT NOT NULL,
    PRIMARY KEY (user_id, user_group_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (user_group_id) REFERENCES user_groups(id) ON DELETE CASCADE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_uug_user ON user_user_groups(user_id);
CREATE INDEX IF NOT EXISTS idx_uug_group ON user_user_groups(user_group_id);

-- =====================================================
-- INITIAL DATA - ROLES
-- Purpose: Create system roles with all required fields
-- =====================================================
INSERT INTO roles (id, name, description, active, deleted, created_at, updated_at) VALUES
(1, 'ROLE_PATIENT', 'Patient Role - Access to patient portal and personal medical records', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'ROLE_DOCTOR', 'Doctor Role - Access to medical records, patient data, and clinical tools', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'ROLE_ADMIN', 'Administrator Role - Full system access and user management', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'ROLE_FINANCE', 'Finance Role - Access to billing, payments, and financial reports', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'ROLE_RADIOLOGIST', 'Radiologist Role - Access to imaging data and radiology systems', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'ROLE_STAFF', 'Staff Role - Access to medical records, patient data', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'ROLE_TECHNICIAN', 'Technician Role - Access to the image data and upload images', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- INITIAL DATA - USER GROUPS
-- Purpose: Create organizational groups with all required fields
-- =====================================================
INSERT INTO user_groups (id, name, description, active, deleted, created_at, updated_at) VALUES
(1, 'PATIENTS', 'Group for all patient users', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(2, 'DOCTORS', 'Group for all doctor users', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(3, 'ADMINS', 'Group for all administrator users', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(4, 'FINANCE', 'Group for all finance staff users', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(5, 'RADIOLOGISTS', 'Group for all radiologist users', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(6, 'STAFFS', 'Group for general staff members', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
(7, 'TECHNICIANS', 'Group for Technician members', true, false, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- NOTE: user_group_roles table
-- =====================================================
-- The user_group_roles table is not defined in your schema.
-- You may need to create it first, or you might be referring to a different table.
-- If you need this table, here's a suggested definition:

CREATE TABLE IF NOT EXISTS public.user_group_roles (
    user_group_id int8 NOT NULL,
    role_id int8 NOT NULL,
    CONSTRAINT user_group_roles_pkey PRIMARY KEY (user_group_id, role_id),
    CONSTRAINT fk_ugr_group FOREIGN KEY (user_group_id) REFERENCES public.user_groups(id),
    CONSTRAINT fk_ugr_role FOREIGN KEY (role_id) REFERENCES public.roles(id)
);
CREATE INDEX IF NOT EXISTS idx_ugr_group ON public.user_group_roles USING btree (user_group_id);
CREATE INDEX IF NOT EXISTS idx_ugr_role ON public.user_group_roles USING btree (role_id);

-- =====================================================
-- INITIAL DATA - GROUP ROLE ASSIGNMENTS
-- Purpose: Assign roles to groups
-- =====================================================
INSERT INTO user_group_roles (user_group_id, role_id) VALUES
(1, 1), -- PATIENTS group has ROLE_PATIENT
(2, 2), -- DOCTORS group has ROLE_DOCTOR
(3, 3), -- ADMINS group has ROLE_ADMIN
(4, 4), -- FINANCE group has ROLE_FINANCE
(5, 5), -- RADIOLOGISTS group has ROLE_RADIOLOGIST
(6, 6), -- STAFFS group has ROLE_STAFF
(7, 7)  -- TECHNICIANS group has ROLE_TECHNICIAN
ON CONFLICT DO NOTHING;

-- =====================================================
-- Reset sequences to continue from correct values
-- =====================================================
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('user_groups_id_seq', (SELECT MAX(id) FROM user_groups));
-- =====================================================
-- VERIFICATION QUERIES
-- Run these to verify setup
-- =====================================================
-- SELECT * FROM roles;
-- SELECT * FROM user_groups;
-- SELECT * FROM users;
-- SELECT * FROM user_group_roles;
-- SELECT * FROM user_user_groups;

-- =====================================================
-- HELPFUL VIEWS (Optional)
-- =====================================================

