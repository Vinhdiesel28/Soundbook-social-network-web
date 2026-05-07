package com.soundbook.utils;

import com.soundbook.dto.response.PageResponse;
import org.springframework.data.domain.Page;

import java.util.List;

public class PageMapper
{
    public static <T> PageResponse<T> toPageResponse(Page<T> page)
    {
        return PageResponse.<T>builder()
                .content(page.getContent())
                .pageNumber(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }

    public static <T, R> PageResponse<R> toPageResponse(Page<T> page, List<R> mappedContent)
    {
        return PageResponse.<R>builder()
                .content(mappedContent)
                .pageNumber(page.getNumber() + 1)
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .isFirst(page.isFirst())
                .isLast(page.isLast())
                .build();
    }
}
