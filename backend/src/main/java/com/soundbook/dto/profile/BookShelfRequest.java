package com.soundbook.dto.profile;

import com.soundbook.entity.enums.BookshelfCode;
import com.soundbook.entity.enums.Visibility;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class BookShelfRequest {
    private BookshelfCode shelfCode;
    private String bookKey;
    private String title;
    private String author;
    private String coverUrl;
    private String description;
    private Integer progressPage;
    private BigDecimal progressPercent;
    private Byte rating;
    private Visibility visibility;
}
