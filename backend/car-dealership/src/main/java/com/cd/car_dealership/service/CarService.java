package com.cd.car_dealership.service;

import com.cd.car_dealership.dto.CarDTO;
import com.cd.car_dealership.model.Car;
import com.cd.car_dealership.model.ImageInfo;
import com.cd.car_dealership.repository.CarRepository;
import com.cd.car_dealership.repository.ImageInfoRepository;
import com.cd.car_dealership.service.CloudinaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CarService {
    
    private final CarRepository carRepository;
    private final ImageInfoRepository imageInfoRepository;
    private final CloudinaryService cloudinaryService;

    public List<CarDTO> getAllCars() {
        return carRepository.findAll().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Optional<CarDTO> getCarById(Long id) {
        return carRepository.findById(id)
                .map(this::convertToDTO);
    }

    public CarDTO createCar(CarDTO carDTO) {
        Car car = convertToEntity(carDTO);
        Car savedCar = carRepository.save(car);
        return convertToDTO(savedCar);
    }

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
                    existingCar.setTransmission(carDTO.getTransmission());
                    existingCar.setDescription(carDTO.getDescription());
                    return convertToDTO(carRepository.save(existingCar));
                });
    }

    public Optional<CarDTO> addImageToGallery(Long carId, MultipartFile file) {
        try {
            System.out.println("Adding image to gallery for car ID: " + carId);
            CloudinaryService.CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithPublicId(file);
            System.out.println("Image uploaded to Cloudinary: " + uploadResult.getImageUrl());
            
            return carRepository.findById(carId)
                    .map(car -> {
                        System.out.println("Found car: " + car.getBrand() + " " + car.getModel());
                        
                        ImageInfo imageInfo = ImageInfo.builder()
                                .imageUrl(uploadResult.getImageUrl())
                                .publicId(uploadResult.getPublicId())
                                .build();
                        imageInfo.setCar(car);
                        
                        if (car.getImageGallery() == null) {
                            car.setImageGallery(new ArrayList<>());
                        }
                        car.getImageGallery().add(imageInfo);
                        
                        System.out.println("Image added to car gallery. Total images: " + car.getImageGallery().size());
                        
                        Car savedCar = carRepository.save(car);
                        System.out.println("Car saved with ID: " + savedCar.getId());
                        
                        return convertToDTO(savedCar);
                    });
        } catch (Exception e) {
            System.err.println("Error adding image to gallery: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to upload image to gallery", e);
        }
    }

    public Optional<CarDTO> removeImageFromGallery(Long carId, String imageUrl) {
        return carRepository.findById(carId)
                .map(car -> {
                    if (car.getImageGallery() != null) {
                        Optional<ImageInfo> imageToRemove = car.getImageGallery().stream()
                                .filter(img -> img.getImageUrl().equals(imageUrl))
                                .findFirst();
                        
                        if (imageToRemove.isPresent()) {
                            ImageInfo imageInfo = imageToRemove.get();

                            try {
                                cloudinaryService.deleteImage(imageInfo.getPublicId());
                            } catch (Exception e) {
                                System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
                            }

                            car.getImageGallery().remove(imageInfo);
                            imageInfoRepository.delete(imageInfo);
                        }
                        
                        return convertToDTO(carRepository.save(car));
                    }
                    return convertToDTO(car);
                });
    }

    public boolean deleteCar(Long id) {
        return carRepository.findById(id)
                .map(car -> {
                    if (car.getImageGallery() != null) {
                        for (ImageInfo imageInfo : car.getImageGallery()) {
                            try {
                                cloudinaryService.deleteImage(imageInfo.getPublicId());
                            } catch (Exception e) {
                                System.err.println("Failed to delete image from Cloudinary: " + e.getMessage());
                            }
                        }
                    }
                    
                    carRepository.deleteById(id);
                    return true;
                })
                .orElse(false);
    }

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

    public List<String> getAllBrands() {
        return carRepository.findAll().stream()
                .map(Car::getBrand)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    public List<String> getAllFuelTypes() {
        return carRepository.findAll().stream()
                .map(Car::getFuelType)
                .distinct()
                .sorted()
                .collect(Collectors.toList());
    }

    private CarDTO convertToDTO(Car car) {
        return CarDTO.builder()
                .id(car.getId())
                .brand(car.getBrand())
                .model(car.getModel())
                .productionYear(car.getProductionYear())
                .price(car.getPrice())
                .fuelType(car.getFuelType())
                .mileage(car.getMileage())
                .engineCapacity(car.getEngineCapacity())
                .transmission(car.getTransmission())
                .description(car.getDescription())
                .createdAt(car.getCreatedAt())
                .updatedAt(car.getUpdatedAt())
                .imageGallery(car.getImageUrls())
                .build();
    }

    private Car convertToEntity(CarDTO carDTO) {
        return Car.builder()
                .brand(carDTO.getBrand())
                .model(carDTO.getModel())
                .productionYear(carDTO.getProductionYear())
                .price(carDTO.getPrice())
                .fuelType(carDTO.getFuelType())
                .mileage(carDTO.getMileage())
                .engineCapacity(carDTO.getEngineCapacity())
                .transmission(carDTO.getTransmission())
                .description(carDTO.getDescription())
                .build();
        // Note: imageGallery is not set from DTO as it's managed separately
    }
} 