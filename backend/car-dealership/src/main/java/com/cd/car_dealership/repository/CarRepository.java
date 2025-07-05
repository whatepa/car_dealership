package com.cd.car_dealership.repository;

import com.cd.car_dealership.model.Car;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public interface CarRepository extends JpaRepository<Car, Long> {
    
    // Basic search methods
    List<Car> findByBrandContainingIgnoreCase(String brand);
    List<Car> findByModelContainingIgnoreCase(String model);
    List<Car> findByFuelTypeContainingIgnoreCase(String fuelType);
    
    // Price range search
    List<Car> findByPriceBetween(BigDecimal minPrice, BigDecimal maxPrice);
    List<Car> findByPriceLessThanEqual(BigDecimal maxPrice);
    List<Car> findByPriceGreaterThanEqual(BigDecimal minPrice);
    
    // Year range search
    List<Car> findByProductionYearBetween(Integer minYear, Integer maxYear);
    List<Car> findByProductionYearGreaterThanEqual(Integer minYear);
    List<Car> findByProductionYearLessThanEqual(Integer maxYear);
    
    // Mileage range search
    List<Car> findByMileageBetween(Integer minMileage, Integer maxMileage);
    List<Car> findByMileageLessThanEqual(Integer maxMileage);
    List<Car> findByMileageGreaterThanEqual(Integer minMileage);
    
    // Engine capacity range search
    List<Car> findByEngineCapacityBetween(Double minCapacity, Double maxCapacity);
    List<Car> findByEngineCapacityGreaterThanEqual(Double minCapacity);
    List<Car> findByEngineCapacityLessThanEqual(Double maxCapacity);
    
    // Complex search with multiple criteria
    @Query("SELECT c FROM Car c WHERE " +
           "(:brand IS NULL OR LOWER(c.brand) LIKE LOWER(CONCAT('%', :brand, '%'))) AND " +
           "(:model IS NULL OR LOWER(c.model) LIKE LOWER(CONCAT('%', :model, '%'))) AND " +
           "(:fuelType IS NULL OR LOWER(c.fuelType) LIKE LOWER(CONCAT('%', :fuelType, '%'))) AND " +
           "(:minYear IS NULL OR c.productionYear >= :minYear) AND " +
           "(:maxYear IS NULL OR c.productionYear <= :maxYear) AND " +
           "(:minPrice IS NULL OR c.price >= :minPrice) AND " +
           "(:maxPrice IS NULL OR c.price <= :maxPrice) AND " +
           "(:minMileage IS NULL OR c.mileage >= :minMileage) AND " +
           "(:maxMileage IS NULL OR c.mileage <= :maxMileage) AND " +
           "(:minEngineCapacity IS NULL OR c.engineCapacity >= :minEngineCapacity) AND " +
           "(:maxEngineCapacity IS NULL OR c.engineCapacity <= :maxEngineCapacity)")
    List<Car> findCarsByCriteria(
            @Param("brand") String brand,
            @Param("model") String model,
            @Param("fuelType") String fuelType,
            @Param("minYear") Integer minYear,
            @Param("maxYear") Integer maxYear,
            @Param("minPrice") BigDecimal minPrice,
            @Param("maxPrice") BigDecimal maxPrice,
            @Param("minMileage") Integer minMileage,
            @Param("maxMileage") Integer maxMileage,
            @Param("minEngineCapacity") Double minEngineCapacity,
            @Param("maxEngineCapacity") Double maxEngineCapacity
    );
} 