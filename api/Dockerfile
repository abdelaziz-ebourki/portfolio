# Portfolio API — multi-stage build (Java 25, Spring Boot 4).
# Build context is api/ (see docker-compose.yml); tests run in CI
# and locally via ./mvnw test, so the image build skips them for speed.
FROM maven:3.9-eclipse-temurin-25 AS build
WORKDIR /build

# Dependency layer first: re-runs only when pom.xml changes.
COPY pom.xml ./
COPY .mvn ./.mvn
COPY mvnw ./
RUN ./mvnw -q dependency:go-offline

# Application layer: re-runs on every source change.
COPY src ./src
RUN ./mvnw -q package -DskipTests

FROM eclipse-temurin:25-jre-alpine
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring
WORKDIR /app

COPY --from=build --chown=spring:spring /build/target/portfolio-api-*.jar app.jar

EXPOSE 8080

HEALTHCHECK --interval=10s --timeout=3s --retries=5 \
  CMD wget -qO- http://localhost:8080/api/health | grep -q '"status":"UP"'

ENTRYPOINT ["java", "-jar", "app.jar"]
