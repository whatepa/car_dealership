package com.cd.car_dealership.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CarDTO {
    private Long id;
    private String brand;
    private String model;
    private Integer productionYear;
    private BigDecimal price;
    private String fuelType;
    private Integer mileage;
    private Double engineCapacity;
    private String transmission;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<String> imageGallery; // Keep as List<String> for frontend compatibility

    // Helper method to get main image (first image in gallery)
    public String getMainImage() {
        return imageGallery != null && !imageGallery.isEmpty() ? imageGallery.get(0) : null;
    }
} 