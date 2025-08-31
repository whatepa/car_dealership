package com.cd.car_dealership.controller;

import com.cd.car_dealership.dto.CarDTO;
import com.cd.car_dealership.service.CarService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/cars")
@RequiredArgsConstructor
public class CarController {
    
    private final CarService carService;

    @GetMapping
    public ResponseEntity<List<CarDTO>> getAllCars() {
        List<CarDTO> cars = carService.getAllCars();
        return ResponseEntity.ok(cars);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CarDTO> getCarById(@PathVariable Long id) {
        Optional<CarDTO> car = carService.getCarById(id);
        return car.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarDTO> createCar(@RequestBody CarDTO carDTO) {
        CarDTO createdCar = carService.createCar(carDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(createdCar);
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarDTO> updateCar(@PathVariable Long id, @RequestBody CarDTO carDTO) {
        Optional<CarDTO> updatedCar = carService.updateCar(id, carDTO);
        return updatedCar.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Void> deleteCar(@PathVariable Long id) {
        boolean deleted = carService.deleteCar(id);
        return deleted ? ResponseEntity.noContent().build() : ResponseEntity.notFound().build();
    }

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

    @GetMapping("/brands")
    public ResponseEntity<List<String>> getAllBrands() {
        List<String> brands = carService.getAllBrands();
        return ResponseEntity.ok(brands);
    }

    @GetMapping("/fuel-types")
    public ResponseEntity<List<String>> getAllFuelTypes() {
        List<String> fuelTypes = carService.getAllFuelTypes();
        return ResponseEntity.ok(fuelTypes);
    }

    @PostMapping("/{id}/gallery")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarDTO> addImageToGallery(@PathVariable Long id, @RequestParam("file") MultipartFile file) {
        System.out.println("CarController: Adding image to gallery for car ID: " + id);
        System.out.println("CarController: File name: " + file.getOriginalFilename() + ", size: " + file.getSize());
        
        Optional<CarDTO> updatedCar = carService.addImageToGallery(id, file);
        
        if (updatedCar.isPresent()) {
            System.out.println("CarController: Image added successfully");
            return ResponseEntity.ok(updatedCar.get());
        } else {
            System.out.println("CarController: Failed to add image - car not found");
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}/gallery")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<CarDTO> removeImageFromGallery(@PathVariable Long id, @RequestParam("imageUrl") String imageUrl) {
        Optional<CarDTO> updatedCar = carService.removeImageFromGallery(id, imageUrl);
        return updatedCar.map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
} 