package com.soundbook.entity;

import com.soundbook.entity.enums.BookshelfCode;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "bookshelves")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Bookshelf {

    @Id
    private Integer id;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, unique = true)
    private BookshelfCode code;

    @Column(nullable = false, length = 50)
    private String name;
}
