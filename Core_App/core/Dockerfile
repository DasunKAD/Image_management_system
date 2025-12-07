# Core_App/core/Dockerfile
FROM maven:3.9.6-eclipse-temurin-17 AS build

WORKDIR /app

# Copy parent pom
COPY pom.xml .

# Copy common module
COPY common/pom.xml common/
COPY common/src common/src

# Copy sso pom to satisfy parent reactor check
COPY sso/pom.xml sso/

# Copy core module
COPY core/pom.xml core/
COPY core/src core/src

# Build the application
RUN mvn clean package -pl core -am -DskipTests

FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/core/target/*.jar app.jar

EXPOSE 8082

ENTRYPOINT ["java", "-jar", "app.jar"]