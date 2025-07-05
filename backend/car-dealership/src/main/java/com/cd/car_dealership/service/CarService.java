package com.cd.car_dealership.service;

import com.cd.car_dealership.dto.CarDTO;
import com.cd.car_dealership.model.Car;
import com.cd.car_dealership.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {
    
    @Autowired
    private CarRepository carRepository;
    
    // Get all cars
    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }
    
    // Get car by ID
    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id)
                .map(this::convertToDTO);
    }
    
    // Create new car
    public CarDTO createCar(CarDTO carDTO) {
        Car car = convertToEntity(carDTO);
        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }
    
    // Update car
    public Optional<CarDTO> updateCar(Long id, CarDTO carDTO) {
        return carRepository.findById(id)
                .map(existingCar -> {
                    existingCar.setBrand(carDTO.getBrand());
                    existingCar.setModel(carDTO.getModel());
                    existingCar.setProductionYear(carDTO.getProductionYear());
                    existingCar.setPrice(carDTO.getPrice());
                    existingCar.setFuelType(carDTO.getFuelType());
                    existingCar.setMileage(carDTO.getMileage());
                    existingCar.setEngineCapacity(carDTO.getEngineCapacity());
                    return convertToDTO(carRepository.save(existingCar));
                });
    }
    
    // Delete car
    public boolean deleteCar(Long id) {
        if (carRepository.existsById(id)) {
            carRepository.deleteById(id);
            return true;
        }
        return false;
    }
    
    // Search cars by criteria
    public List<CarDTO> searchCars(String brand, String model, String fuelType,
                                   Integer minYear, Integer maxYear,
                                   BigDecimal minPrice, BigDecimal maxPrice,
                                   Integer minMileage, Integer maxMileage,
                                   Double minEngineCapacity, Double maxEngineCapacity) {
        return carRepository.findCarsByCriteria(
                brand, model, fuelType,
                minYear, maxYear,
                minPrice, maxPrice,
                minMileage, maxMileage,
                minEngineCapacity, maxEngineCapacity
        ).stream()
        .map(this::convertToDTO)
        .collect(Collectors.toList());
    }
    
    // Get all brands
    public List<String> getAllBrands() {
        return carRepository.findAll().stream()
                .map(Car::getBrand)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    // Get all fuel types
    public List<String> getAllFuelTypes() {
        return carRepository.findAll().stream()
                .map(Car::getFuelType)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }
    
    // Convert Entity to DTO
    private CarDTO convertToDTO(Car car) {
        return new CarDTO(
                car.getId(),
                car.getBrand(),
                car.getModel(),
                car.getProductionYear(),
                car.getPrice(),
                car.getFuelType(),
                car.getMileage(),
                car.getEngineCapacity(),
                car.getCreatedAt(),
                car.getUpdatedAt()
        );
    }
    
    // Convert DTO to Entity
    private Car convertToEntity(CarDTO carDTO) {
        Car car = new Car();
        car.setBrand(carDTO.getBrand());
        car.setModel(carDTO.getModel());
        car.setProductionYear(carDTO.getProductionYear());
        car.setPrice(carDTO.getPrice());
        car.setFuelType(carDTO.getFuelType());
        car.setMileage(carDTO.getMileage());
        car.setEngineCapacity(carDTO.getEngineCapacity());
        return car;
    }
} 