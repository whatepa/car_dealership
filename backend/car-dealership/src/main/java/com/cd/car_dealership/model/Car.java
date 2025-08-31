package com.cd.car_dealership.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Builder;
import lombok.EqualsAndHashCode;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "cars")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@EqualsAndHashCode(exclude = {"imageGallery"})
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
    
    @Column(nullable = false)
    private String transmission;
    
    @Column(columnDefinition = "TEXT")
    private String description;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "car", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ImageInfo> imageGallery = new ArrayList<>();
    
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }
    
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
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

}