package com.soundbook.service.admin;

import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;

public interface FileUploadService
{
    String uploadFile(MultipartFile file, String folderName) throws IOException;

    void deleteFile(String imageUrl) throws IOException;
}
