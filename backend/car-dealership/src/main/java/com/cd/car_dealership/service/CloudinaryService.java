package com.cd.car_dealership.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    
    private final Cloudinary cloudinary;
    
    @Autowired
    private ImageValidationService imageValidationService;
    
    public CloudinaryService(
            @Value("${cloudinary.cloud-name}") String cloudName,
            @Value("${cloudinary.api-key}") String apiKey,
            @Value("${cloudinary.api-secret}") String apiSecret) {
        
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
        imageValidationService.validateImage(file);

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "quality", "auto",
                "fetch_format", "auto",
                "width", 1200,
                "height", 800,
                "crop", "limit"
        ));
        
        return new CloudinaryUploadResult(
                (String) uploadResult.get("secure_url"),
                (String) uploadResult.get("public_id")
        );
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

    public static class CloudinaryUploadResult {
        private final String imageUrl;
        private final String publicId;
        
        public CloudinaryUploadResult(String imageUrl, String publicId) {
            this.imageUrl = imageUrl;
            this.publicId = publicId;
        }
        
        public String getImageUrl() {
            return imageUrl;
        }
        
        public String getPublicId() {
            return publicId;
        }
    }
} 