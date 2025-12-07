#!/bin/sh
set -e

# 1. Create Users and Databases
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- SSO Setup
    CREATE USER sso_user WITH PASSWORD 'sso_password';
    CREATE DATABASE sso_db OWNER sso_user;
    GRANT ALL PRIVILEGES ON DATABASE sso_db TO sso_user;

    -- Core Setup
    CREATE USER core_user WITH PASSWORD 'core_password';
    CREATE DATABASE core_db OWNER core_user;
    GRANT ALL PRIVILEGES ON DATABASE core_db TO core_user;
EOSQL

# 2. Populate SSO Database (Only runs against sso_db)
echo "Populating sso_db..."
psql -v ON_ERROR_STOP=1 --username "sso_user" --dbname "sso_db" -f /etc/schema/init-sso-db.sql

# 3. Populate Core Database (Only runs against core_db)
echo "Populating core_db..."
psql -v ON_ERROR_STOP=1 --username "core_user" --dbname "core_db" -f /etc/schema/init-core-db.sql