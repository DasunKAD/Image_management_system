FROM postgres:15-alpine

# 1. Copy the initialization script
COPY create-databases.sh /docker-entrypoint-initdb.d/

# 2. Copy the SQL schema files to the folder where the script expects them
COPY init-sso-db.sql /etc/schema/init-sso-db.sql
COPY init-core-db.sql /etc/schema/init-core-db.sql

# 3. Grant read permissions so the postgres user can read them
RUN chmod -R 755 /etc/schema