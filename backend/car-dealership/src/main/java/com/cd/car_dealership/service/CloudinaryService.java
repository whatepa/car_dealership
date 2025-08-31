package com.cd.car_dealership.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.Data;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import jakarta.annotation.PostConstruct;
import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class CloudinaryService {
    
    private Cloudinary cloudinary;
    private final ImageValidationService imageValidationService;
    
    @Value("${cloudinary.cloud-name}")
    private String cloudName;
    
    @Value("${cloudinary.api-key}")
    private String apiKey;
    
    @Value("${cloudinary.api-secret}")
    private String apiSecret;
    
    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret
        ));
    }

    public String uploadImage(MultipartFile file) throws IOException {
        imageValidationService.validateImage(file);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "quality", "auto",
                "fetch_format", "auto",
                "width", 1200,
                "height", 800,
                "crop", "limit"
        ));
        return (String) uploadResult.get("secure_url");
    }
    
    public CloudinaryUploadResult uploadImageWithPublicId(MultipartFile file) throws IOException {
        System.out.println("Uploading image to Cloudinary: " + file.getOriginalFilename());
        imageValidationService.validateImage(file);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "quality", "auto",
                "fetch_format", "auto",
                "width", 1200,
                "height", 800,
                "crop", "limit"
        ));
        
        String imageUrl = (String) uploadResult.get("secure_url");
        String publicId = (String) uploadResult.get("public_id");
        
        System.out.println("Image uploaded successfully. URL: " + imageUrl + ", Public ID: " + publicId);
        
        return new CloudinaryUploadResult(imageUrl, publicId);
    }
    
    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }

    public String extractPublicIdFromUrl(String imageUrl) {
        if (imageUrl == null || !imageUrl.contains("cloudinary.com")) {
            return null;
        }

        String[] parts = imageUrl.split("/upload/");
        if (parts.length < 2) {
            return null;
        }
        
        String afterUpload = parts[1];
        
        if (afterUpload.startsWith("v")) {
            String[] versionParts = afterUpload.split("/", 2);
            if (versionParts.length > 1) {
                afterUpload = versionParts[1];
            }
        }

        int lastDotIndex = afterUpload.lastIndexOf(".");
        if (lastDotIndex > 0) {
            afterUpload = afterUpload.substring(0, lastDotIndex);
        }
        
        return afterUpload;
    }

    @Data
    @AllArgsConstructor
    public static class CloudinaryUploadResult {
        private final String imageUrl;
        private final String publicId;
    }
} 