package com.cd.car_dealership.repository;

import com.cd.car_dealership.model.ImageInfo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ImageInfoRepository extends JpaRepository<ImageInfo, Long> {
    
    List<ImageInfo> findByCarId(Long carId);
    
    void deleteByCarId(Long carId);
} 