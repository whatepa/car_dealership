# Car Dealership Application

A full-stack car dealership management system with Spring Boot backend and Angular frontend.

## Technology Stack

### Backend

- **Java**: 17+
- **Spring Boot**: 3.x
- **Spring Security**: 6.x
- **Spring Data JPA**: 3.x
- **PostgreSQL**: 14+
- **Maven**: 3.8+

### Frontend

- **Angular**: 17
- **TypeScript**: 5.x
- **Tailwind CSS**: 3.x
- **Node.js**: 18+

## Prerequisites

### Database Setup

**Required**: Create a PostgreSQL database named `car_dealership` before running the application.

### Configuration Setup

**Required**: Rename `application.example.properties` to `application.properties` and update the values accordingly.

- Database connection details (username, password)
- Cloudinary credentials (cloud name, API key, API secret)
- JWT secret key
- Other environment-specific configurations

## Quick Start

1. **Backend**: Navigate to `backend/car-dealership` and run `./mvnw spring-boot:run`
2. **Frontend**: Navigate to `frontend` and run `npm install && npm start`

## Features

- User authentication with JWT
- Car management (CRUD operations)
- Image upload to Cloudinary
- Responsive web interface
