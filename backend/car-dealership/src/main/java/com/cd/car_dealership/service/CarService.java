package com.cd.car_dealership.service;

import com.cd.car_dealership.dto.CarDTO;
import com.cd.car_dealership.model.Car;
import com.cd.car_dealership.model.ImageInfo;
import com.cd.car_dealership.repository.CarRepository;
import com.cd.car_dealership.repository.ImageInfoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CarService {
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private ImageInfoRepository imageInfoRepository;
    
    @Autowired
    private CloudinaryService cloudinaryService;

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
                    return convertToDTO(carRepository.save(existingCar));
                });
    }

    public Optional<CarDTO> addImageToGallery(Long carId, MultipartFile file) {
        try {
            CloudinaryService.CloudinaryUploadResult uploadResult = cloudinaryService.uploadImageWithPublicId(file);
            
            return carRepository.findById(carId)
                    .map(car -> {
                        ImageInfo imageInfo = new ImageInfo(uploadResult.getImageUrl(), uploadResult.getPublicId());
                        imageInfo.setCar(car);
                        
                        if (car.getImageGallery() == null) {
                            car.setImageGallery(new ArrayList<>());
                        }
                        car.getImageGallery().add(imageInfo);
                        
                        return convertToDTO(carRepository.save(car));
                    });
        } catch (Exception e) {
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
                car.getUpdatedAt(),
                car.getImageUrls()
        );
    }

    private Car convertToEntity(CarDTO carDTO) {
        Car car = new Car();
        car.setBrand(carDTO.getBrand());
        car.setModel(carDTO.getModel());
        car.setProductionYear(carDTO.getProductionYear());
        car.setPrice(carDTO.getPrice());
        car.setFuelType(carDTO.getFuelType());
        car.setMileage(carDTO.getMileage());
        car.setEngineCapacity(carDTO.getEngineCapacity());
        // Note: imageGallery is not set from DTO as it's managed separately
        return car;
    }
} 