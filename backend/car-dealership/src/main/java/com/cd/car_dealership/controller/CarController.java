package com.cd.car_dealership.controller;

import com.cd.car_dealership.dto.CarDTO;
import com.cd.car_dealership.service.CarService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@CrossOrigin(origins = "http://localhost:5173")
public class CarController {
    
    @Autowired
    private CarService carService;
    
    // Get all cars
    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }
    
    // Get car by ID
    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Optional<CarDTO> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Create new car
    @PostMapping
    public ResponseEntity<CarDTO> createCar(@RequestBody CarDTO carDTO) {
        CarDTO createdCar = carService.createCar(carDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCar);
    }
    
    // Update car
    @PutMapping("/{id}")
    public ResponseEntity<CarDTO> updateCar(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        Optional<CarDTO> updatedCar = carService.updateCar(id, carDTO);
        return updatedCar.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    // Delete car
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        boolean deleted = carService.deleteCar(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }
    
    // Search cars
    @GetMapping("/search")
    public ResponseEntity<List<CarDTO>> searchCars(
            @RequestParam(required = false) String brand,
            @RequestParam(required = false) String model,
            @RequestParam(required = false) String fuelType,
            @RequestParam(required = false) Integer minYear,
            @RequestParam(required = false) Integer maxYear,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Integer minMileage,
            @RequestParam(required = false) Integer maxMileage,
            @RequestParam(required = false) Double minEngineCapacity,
            @RequestParam(required = false) Double maxEngineCapacity) {
        
        List<CarDTO> cars = carService.searchCars(
                brand, model, fuelType,
                minYear, maxYear,
                minPrice, maxPrice,
                minMileage, maxMileage,
                minEngineCapacity, maxEngineCapacity
        );
        return ResponseEntity.ok(cars);
    }
    
    // Get all brands
    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        List<String> brands = carService.getAllBrands();
        return ResponseEntity.ok(brands);
    }
    
    // Get all fuel types
    @GetMapping("/fuel-types")
    public ResponseEntity<List<String>> getAllFuelTypes() {
        List<String> fuelTypes = carService.getAllFuelTypes();
        return ResponseEntity.ok(fuelTypes);
    }
} 