package com.soundbook.repository;

import com.soundbook.entity.Bookshelf;
import com.soundbook.entity.enums.BookshelfCode;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface BookshelfRepository extends JpaRepository<Bookshelf, Integer> {
    Optional<Bookshelf> findByCode(BookshelfCode code);
}
