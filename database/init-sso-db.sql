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
-- Purpose: Create system roles matching Role.RoleName enum
-- =====================================================
INSERT INTO roles (id, name, description, active) VALUES
(1, 'ROLE_PATIENT', 'Patient Role - Access to patient portal and personal medical records', true),
(2, 'ROLE_DOCTOR', 'Doctor Role - Access to medical records, patient data, and clinical tools', true),
(3, 'ROLE_ADMIN', 'Administrator Role - Full system access and user management', true),
(4, 'ROLE_FINANCE', 'Finance Role - Access to billing, payments, and financial reports', true),
(5, 'ROLE_RADIOLOGIST', 'Radiologist Role - Access to imaging data and radiology systems', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- INITIAL DATA - USER GROUPS
-- Purpose: Create organizational groups
-- =====================================================
INSERT INTO user_groups (id, name, description, active) VALUES
(1, 'PATIENTS', 'Group for all patient users', true),
(2, 'DOCTORS', 'Group for all doctor users', true),
(3, 'ADMINS', 'Group for all administrator users', true),
(4, 'FINANCE', 'Group for all finance staff users', true),
(5, 'RADIOLOGISTS', 'Group for all radiologist users', true),
(6, 'STAFF', 'Group for general staff members', true)
ON CONFLICT (name) DO NOTHING;

-- =====================================================
-- INITIAL DATA - GROUP ROLE ASSIGNMENTS
-- Purpose: Assign roles to groups
-- =====================================================
INSERT INTO user_group_roles (user_group_id, role_id) VALUES
(1, 1), -- PATIENTS group has ROLE_PATIENT
(2, 2), -- DOCTORS group has ROLE_DOCTOR
(3, 3), -- ADMINS group has ROLE_ADMIN
(4, 4), -- FINANCE group has ROLE_FINANCE
(5, 5)  -- RADIOLOGISTS group has ROLE_RADIOLOGIST
ON CONFLICT DO NOTHING;

-- =====================================================
-- INITIAL DATA - DEFAULT ADMIN USER
-- Purpose: Create system administrator account
-- Username: admin
-- Password: admin123 (BCrypt hash)
-- Security: Change this in production!
-- =====================================================
INSERT INTO users (
    id, 
    username, 
    email, 
    password, 
    enabled, 
    account_non_expired, 
    account_non_locked, 
    credentials_non_expired,
    failed_login_attempts,
    deleted,
    created_at, 
    updated_at
) VALUES (
    1,
    'admin',
    'admin@healthcare.com',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', -- BCrypt hash of "admin123"
    true,
    true,
    true,
    true,
    0,
    false,
    CURRENT_TIMESTAMP,
    CURRENT_TIMESTAMP
) ON CONFLICT (username) DO NOTHING;

-- Assign admin user to ADMINS group
INSERT INTO user_user_groups (user_id, user_group_id) VALUES
(1, 3) -- admin user in ADMINS group
ON CONFLICT DO NOTHING;

-- =====================================================
-- RESET SEQUENCES
-- Purpose: Ensure auto-increment continues correctly
-- =====================================================
SELECT setval('roles_id_seq', (SELECT COALESCE(MAX(id), 0) FROM roles) + 1);
SELECT setval('user_groups_id_seq', (SELECT COALESCE(MAX(id), 0) FROM user_groups) + 1);
SELECT setval('users_id_seq', (SELECT COALESCE(MAX(id), 0) FROM users) + 1);

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

-- View to see users with their groups and roles
CREATE OR REPLACE VIEW v_user_permissions AS
SELECT 
    u.id as user_id,
    u.username,
    u.email,
    u.enabled,
    ug.name as group_name,
    r.name as role_name,
    r.description as role_description
FROM users u
LEFT JOIN user_user_groups uug ON u.id = uug.user_id
LEFT JOIN user_groups ug ON uug.user_group_id = ug.id
LEFT JOIN user_group_roles ugr ON ug.id = ugr.user_group_id
LEFT JOIN roles r ON ugr.role_id = r.id
WHERE u.deleted = false
ORDER BY u.username, ug.name, r.name;

-- =====================================================
-- DATABASE NOTES
-- =====================================================
-- 1. All passwords are encrypted using BCrypt (strength 10)
-- 2. JWT tokens expire after 24 hours (configurable)
-- 3. Accounts lock after 5 failed login attempts
-- 4. Soft delete is used (deleted flag) to maintain audit trail
-- 5. Indexes are optimized for common query patterns
-- 6. Foreign keys ensure referential integrity
-- 7. Timestamps are in UTC
-- =====================================================
