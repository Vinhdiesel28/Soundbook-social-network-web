package com.soundbook.dto.dm;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class DmCursorPageResponse<T> {
    private List<T> items;
    private String nextCursor;
}
