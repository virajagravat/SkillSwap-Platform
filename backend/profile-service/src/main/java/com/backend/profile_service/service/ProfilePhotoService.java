package com.backend.profile_service.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import com.backend.profile_service.exception.ProfilePhotoException;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Service
public class ProfilePhotoService {

    private final Path uploadPath;

    public ProfilePhotoService(
            @Value("${profile.upload-dir}") String uploadDir) {

        this.uploadPath = Paths.get(uploadDir)
                .toAbsolutePath()
                .normalize();
    }

    public String savePhoto(MultipartFile file) throws IOException {

        if (file.isEmpty()) {
            throw new IllegalArgumentException("Profile photo cannot be empty");
        }

        String originalFileName = file.getOriginalFilename();

        String contentType = file.getContentType();

        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException(
                    "Only image files are allowed"
            );
        }

        long maxFileSize = 5 * 1024 * 1024;

        if (file.getSize() > maxFileSize) {
            throw new IllegalArgumentException(
                    "Profile photo size must not exceed 5 MB"
            );
        }

        if (originalFileName == null ||
                !(originalFileName.toLowerCase().endsWith(".jpg")
                        || originalFileName.toLowerCase().endsWith(".jpeg")
                        || originalFileName.toLowerCase().endsWith(".png")
                        || originalFileName.toLowerCase().endsWith(".webp"))) {

            throw new IllegalArgumentException(
                    "Only JPG, JPEG, PNG and WEBP images are allowed"
            );
        }

        Files.createDirectories(uploadPath);

        String extension = "";

        if (originalFileName != null && originalFileName.contains(".")) {
            extension = originalFileName.substring(
                    originalFileName.lastIndexOf(".")
            );
        }

        String fileName = UUID.randomUUID() + extension;

        Path targetPath = uploadPath.resolve(fileName);

        Files.copy(
                file.getInputStream(),
                targetPath,
                StandardCopyOption.REPLACE_EXISTING
        );

        return fileName;
    }

    public void deletePhoto(String fileName) throws IOException {

        if (fileName == null || fileName.isBlank()) {
            return;
        }

        Path filePath = uploadPath.resolve(fileName)
                .normalize();

        if (Files.exists(filePath)) {
            Files.delete(filePath);
        }
    }
}
