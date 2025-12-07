# Core_App/sso/Dockerfile

FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy parent pom
COPY pom.xml .

# Copy common module
COPY common/pom.xml common/
COPY common/src common/src

# --- FIX: Copy core pom to satisfy parent reactor check ---
COPY core/pom.xml core/
# ----------------------------------------------------------

# Copy sso module
COPY sso/pom.xml sso/
COPY sso/src sso/src

# Build only the sso module but include dependencies
RUN mvn clean package -pl sso -am -DskipTests

# -------- Runtime Stage --------
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/sso/target/*.jar app.jar

EXPOSE 8081

ENTRYPOINT ["java", "-jar", "app.jar"]