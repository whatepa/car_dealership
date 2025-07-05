package com.cd.car_dealership.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class CarDTO {
    private Long id;
    private String brand;
    private String model;
    private Integer productionYear;
    private BigDecimal price;
    private String fuelType;
    private Integer mileage;
    private Double engineCapacity;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    // Constructors
    public CarDTO() {}
    
    public CarDTO(Long id, String brand, String model, Integer productionYear, 
                  BigDecimal price, String fuelType, Integer mileage, Double engineCapacity,
                  LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.brand = brand;
        this.model = model;
        this.productionYear = productionYear;
        this.price = price;
        this.fuelType = fuelType;
        this.mileage = mileage;
        this.engineCapacity = engineCapacity;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getBrand() {
        return brand;
    }
    
    public void setBrand(String brand) {
        this.brand = brand;
    }
    
    public String getModel() {
        return model;
    }
    
    public void setModel(String model) {
        this.model = model;
    }
    
    public Integer getProductionYear() {
        return productionYear;
    }
    
    public void setProductionYear(Integer productionYear) {
        this.productionYear = productionYear;
    }
    
    public BigDecimal getPrice() {
        return price;
    }
    
    public void setPrice(BigDecimal price) {
        this.price = price;
    }
    
    public String getFuelType() {
        return fuelType;
    }
    
    public void setFuelType(String fuelType) {
        this.fuelType = fuelType;
    }
    
    public Integer getMileage() {
        return mileage;
    }
    
    public void setMileage(Integer mileage) {
        this.mileage = mileage;
    }
    
    public Double getEngineCapacity() {
        return engineCapacity;
    }
    
    public void setEngineCapacity(Double engineCapacity) {
        this.engineCapacity = engineCapacity;
    }
    
    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
    
    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
    
    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }
    
    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
} 