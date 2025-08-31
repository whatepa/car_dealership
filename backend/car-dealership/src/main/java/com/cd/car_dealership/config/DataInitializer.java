package com.cd.car_dealership.config;

import com.cd.car_dealership.model.Car;
import com.cd.car_dealership.model.User;
import com.cd.car_dealership.repository.CarRepository;
import com.cd.car_dealership.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {
    
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        if (carRepository.count() == 0) {
            initializeData();
        }

        if (userRepository.count() == 0) {
            initializeUsers();
        }
    }
    
    private void initializeData() {
        // Sample cars data using Lombok @Builder
//        Car car1 = Car.builder()
//                .brand("BMW")
//                .model("X5")
//                .productionYear(2020)
//                .price(new BigDecimal("150000.00"))
//                .fuelType("Diesel")
//                .mileage(45000)
//                .engineCapacity(3.0)
//                .build();
//
//        Car car2 = Car.builder()
//                .brand("Audi")
//                .model("A4")
//                .productionYear(2019)
//                .price(new BigDecimal("85000.00"))
//                .fuelType("Gasoline")
//                .mileage(32000)
//                .engineCapacity(2.0)
//                .build();
//
//        Car car3 = Car.builder()
//                .brand("Mercedes")
//                .model("C-Class")
//                .productionYear(2021)
//                .price(new BigDecimal("120000.00"))
//                .fuelType("Gasoline")
//                .mileage(28000)
//                .engineCapacity(2.0)
//                .build();
//
//        Car car4 = Car.builder()
//                .brand("Volkswagen")
//                .model("Golf")
//                .productionYear(2018)
//                .price(new BigDecimal("65000.00"))
//                .fuelType("Diesel")
//                .mileage(55000)
//                .engineCapacity(1.6)
//                .build();
//
//        Car car5 = Car.builder()
//                .brand("Toyota")
//                .model("Corolla")
//                .productionYear(2022)
//                .price(new BigDecimal("95000.00"))
//                .fuelType("Hybrid")
//                .mileage(15000)
//                .engineCapacity(1.8)
//                .build();
//
//        Car car6 = Car.builder()
//                .brand("Ford")
//                .model("Focus")
//                .productionYear(2020)
//                .price(new BigDecimal("75000.00"))
//                .fuelType("Gasoline")
//                .mileage(38000)
//                .engineCapacity(1.5)
//                .build();
//
//        Car car7 = Car.builder()
//                .brand("Skoda")
//                .model("Octavia")
//                .productionYear(2021)
//                .price(new BigDecimal("90000.00"))
//                .fuelType("Diesel")
//                .mileage(25000)
//                .engineCapacity(2.0)
//                .build();
//
//        Car car8 = Car.builder()
//                .brand("Hyundai")
//                .model("i30")
//                .productionYear(2019)
//                .price(new BigDecimal("70000.00"))
//                .fuelType("Gasoline")
//                .mileage(42000)
//                .engineCapacity(1.4)
//                .build();
//
//        Car car9 = Car.builder()
//                .brand("Kia")
//                .model("Sportage")
//                .productionYear(2020)
//                .price(new BigDecimal("110000.00"))
//                .fuelType("Diesel")
//                .mileage(35000)
//                .engineCapacity(1.6)
//                .build();
//
//        Car car10 = Car.builder()
//                .brand("Peugeot")
//                .model("308")
//                .productionYear(2021)
//                .price(new BigDecimal("80000.00"))
//                .fuelType("Gasoline")
//                .mileage(22000)
//                .engineCapacity(1.2)
//                .build();
//
//        carRepository.save(car1);
//        carRepository.save(car2);
//        carRepository.save(car3);
//        carRepository.save(car4);
//        carRepository.save(car5);
//        carRepository.save(car6);
//        carRepository.save(car7);
//        carRepository.save(car8);
//        carRepository.save(car9);
//        carRepository.save(car10);
//
//        System.out.println("Sample data initialized successfully!");
    }
    
    private void initializeUsers() {
        User admin = User.builder()
                .username("admin")
                .password("admin123")
                .role("ADMIN")
                .build();
        userRepository.save(admin);
        System.out.println("Admin user initialized successfully!");
    }
} 