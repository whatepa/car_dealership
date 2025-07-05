package com.cd.car_dealership.config;

import com.cd.car_dealership.model.Car;
import com.cd.car_dealership.model.User;
import com.cd.car_dealership.repository.CarRepository;
import com.cd.car_dealership.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;

@Component
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private CarRepository carRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Override
    public void run(String... args) throws Exception {
        // Check if data already exists
        if (carRepository.count() == 0) {
            initializeData();
        }
        
        // Initialize admin user if not exists
        if (userRepository.count() == 0) {
            initializeUsers();
        }
    }
    
    private void initializeData() {
        // Sample cars data
        Car car1 = new Car("BMW", "X5", 2020, new BigDecimal("150000.00"), "Diesel", 45000, 3.0);
        Car car2 = new Car("Audi", "A4", 2019, new BigDecimal("85000.00"), "Gasoline", 32000, 2.0);
        Car car3 = new Car("Mercedes", "C-Class", 2021, new BigDecimal("120000.00"), "Gasoline", 28000, 2.0);
        Car car4 = new Car("Volkswagen", "Golf", 2018, new BigDecimal("65000.00"), "Diesel", 55000, 1.6);
        Car car5 = new Car("Toyota", "Corolla", 2022, new BigDecimal("95000.00"), "Hybrid", 15000, 1.8);
        Car car6 = new Car("Ford", "Focus", 2020, new BigDecimal("75000.00"), "Gasoline", 38000, 1.5);
        Car car7 = new Car("Skoda", "Octavia", 2021, new BigDecimal("90000.00"), "Diesel", 25000, 2.0);
        Car car8 = new Car("Hyundai", "i30", 2019, new BigDecimal("70000.00"), "Gasoline", 42000, 1.4);
        Car car9 = new Car("Kia", "Sportage", 2020, new BigDecimal("110000.00"), "Diesel", 35000, 1.6);
        Car car10 = new Car("Peugeot", "308", 2021, new BigDecimal("80000.00"), "Gasoline", 22000, 1.2);
        
        carRepository.save(car1);
        carRepository.save(car2);
        carRepository.save(car3);
        carRepository.save(car4);
        carRepository.save(car5);
        carRepository.save(car6);
        carRepository.save(car7);
        carRepository.save(car8);
        carRepository.save(car9);
        carRepository.save(car10);
        
        System.out.println("Sample data initialized successfully!");
    }
    
    private void initializeUsers() {
        User admin = new User("admin", "admin123", "ADMIN");
        userRepository.save(admin);
        System.out.println("Admin user initialized successfully!");
    }
} 