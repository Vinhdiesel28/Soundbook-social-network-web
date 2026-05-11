package com.soundbook.service.admin.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.soundbook.service.admin.FileUploadService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class FileUploadServiceImpl implements FileUploadService
{
    private final Cloudinary cloudinary;

    @Override
    public String uploadFile(MultipartFile file, String folderName) throws IOException
    {
        if (file.isEmpty())
        {
            throw new IllegalArgumentException("File không được để trống!");
        }

        String publicId = UUID.randomUUID().toString();

        Map<String, Object> uploadParams = ObjectUtils.asMap(
                "folder", "soundbook/" + folderName,
                "public_id", publicId,
                "resource_type", "auto"
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        return uploadResult.get("secure_url").toString();
    }

    @Override
    public void deleteFile(String imageUrl) throws IOException
    {
        if (imageUrl == null || !imageUrl.contains("cloudinary")) return;

        try
        {
            String publicId = imageUrl.substring(imageUrl.indexOf("soundbook/"), imageUrl.lastIndexOf("."));
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (Exception e)
        {
            System.out.println("Lỗi khi xóa ảnh trên Cloudinary: " + e.getMessage());
        }
    }
}
