FROM openjdk:17-jdk-slim

WORKDIR /app

# Copy Maven wrapper and pom.xml from backend
COPY backend/car-dealership/mvnw .
COPY backend/car-dealership/.mvn .mvn
COPY backend/car-dealership/pom.xml .

# Make Maven wrapper executable
RUN chmod +x mvnw

# Download dependencies
RUN ./mvnw dependency:go-offline -B

# Copy source code from backend
COPY backend/car-dealership/src src

# Build the application
RUN ./mvnw clean package -DskipTests

# Expose port 8080
EXPOSE 8080

# Run the application
CMD ["java", "-jar", "target/*.jar"]
