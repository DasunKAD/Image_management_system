-- SSO Database Initialization Script
-- This script creates the initial roles and user groups for the SSO system

-- Create Roles
INSERT INTO roles (id, name, description) VALUES
(1, 'ROLE_PATIENT', 'Role for patients'),
(2, 'ROLE_DOCTOR', 'Role for doctors'),
(3, 'ROLE_ADMIN', 'Role for administrators'),
(4, 'ROLE_FINANCE', 'Role for finance staff'),
(5, 'ROLE_RADIOLOGIST', 'Role for radiologists')
ON CONFLICT (name) DO NOTHING;

-- Create User Groups
INSERT INTO user_groups (id, name, description, created_at) VALUES
(1, 'PATIENTS', 'Group for all patients', CURRENT_TIMESTAMP),
(2, 'DOCTORS', 'Group for all doctors', CURRENT_TIMESTAMP),
(3, 'ADMINS', 'Group for all administrators', CURRENT_TIMESTAMP),
(4, 'FINANCE', 'Group for all finance staff', CURRENT_TIMESTAMP),
(5, 'RADIOLOGISTS', 'Group for all radiologists', CURRENT_TIMESTAMP),
(6, 'STAFF', 'Group for general staff', CURRENT_TIMESTAMP)
ON CONFLICT (name) DO NOTHING;

-- Assign Roles to User Groups
INSERT INTO user_group_roles (user_group_id, role_id) VALUES
(1, 1), -- PATIENTS group has ROLE_PATIENT
(2, 2), -- DOCTORS group has ROLE_DOCTOR
(3, 3), -- ADMINS group has ROLE_ADMIN
(4, 4), -- FINANCE group has ROLE_FINANCE
(5, 5)  -- RADIOLOGISTS group has ROLE_RADIOLOGIST
ON CONFLICT DO NOTHING;

-- Create default admin user
-- Username: admin
-- Password: admin123 (BCrypt hash)
INSERT INTO users (id, username, email, password, enabled, account_non_expired, account_non_locked, credentials_non_expired, created_at, updated_at) VALUES
(1, 'admin', 'admin@healthcare.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', true, true, true, true, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
ON CONFLICT (username) DO NOTHING;

-- Assign admin user to ADMINS group
INSERT INTO user_user_groups (user_id, user_group_id) VALUES
(1, 3) -- admin user in ADMINS group
ON CONFLICT DO NOTHING;

-- Reset sequences
SELECT setval('roles_id_seq', (SELECT MAX(id) FROM roles));
SELECT setval('user_groups_id_seq', (SELECT MAX(id) FROM user_groups));
SELECT setval('users_id_seq', (SELECT MAX(id) FROM users));
