package com.cd.car_dealership.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "cars")
public class Car {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false)
    private String brand;
    
    @Column(nullable = false)
    private String model;
    
    @Column(name = "production_year", nullable = false)
    private Integer productionYear;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;
    
    @Column(name = "fuel_type", nullable = false)
    private String fuelType;
    
    @Column(nullable = false)
    private Integer mileage;
    
    @Column(name = "engine_capacity", nullable = false)
    private Double engineCapacity;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    
    // New @OneToMany relationship with ImageInfo
    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageInfo> imageGallery = new ArrayList<>();
    

    public Car() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    public Car(String brand, String model, Integer productionYear, BigDecimal price, 
               String fuelType, Integer mileage, Double engineCapacity) {
        this();
        this.brand = brand;
        this.model = model;
        this.productionYear = productionYear;
        this.price = price;
        this.fuelType = fuelType;
        this.mileage = mileage;
        this.engineCapacity = engineCapacity;
    }

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

    public List<ImageInfo> getImageGallery() {
        return imageGallery;
    }
    
    public void setImageGallery(List<ImageInfo> imageGallery) {
        this.imageGallery = imageGallery;
    }

    // Helper methods for frontend compatibility
    public String getMainImage() {
        return imageGallery != null && !imageGallery.isEmpty() ? imageGallery.get(0).getImageUrl() : null;
    }
    
    public List<String> getImageUrls() {
        if (imageGallery == null) return new ArrayList<>();
        return imageGallery.stream()
                .map(ImageInfo::getImageUrl)
                .collect(ArrayList::new, ArrayList::add, ArrayList::addAll);
    }
    
    @PreUpdate
    public void preUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
} 