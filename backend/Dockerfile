# Build Stage
FROM maven:3.9.9-eclipse-temurin-17-alpine AS builder
WORKDIR /app

# Copy pom.xml and source code
COPY pom.xml .
COPY src ./src

# Build production jar
RUN mvn clean package -DskipTests -B

# Runtime Stage
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Create non-root user for security and ensure storage directory permissions
RUN addgroup --system spring && adduser --system --ingroup spring spring \
    && mkdir -p /app/uploads/media \
    && chown -R spring:spring /app

USER spring:spring

# Copy compiled jar from builder
COPY --from=builder --chown=spring:spring /app/target/*.jar app.jar

# Expose default port
EXPOSE 8080

# Environment variables
ENV PORT=8080
ENV JAVA_OPTS="-Xms128m -Xmx320m -XX:+UseContainerSupport -XX:MaxRAMPercentage=75.0 -XX:+ExitOnOutOfMemoryError"

# Launch Spring Boot with dynamic PORT from hosting platform
ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -Dserver.port=${PORT:-8080} -jar app.jar"]
