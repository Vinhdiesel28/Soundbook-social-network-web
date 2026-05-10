package com.soundbook.dto.profile;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProfileShelfResponse {
    private String id;
    private String title;
    private List<ProfileShelfItemResponse> items;
}
