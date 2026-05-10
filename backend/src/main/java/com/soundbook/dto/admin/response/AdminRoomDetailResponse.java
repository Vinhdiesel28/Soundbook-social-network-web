package com.soundbook.dto.admin.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoomDetailResponse
{
    private AdminRoomResponse info;
    private String currentTrackId;
    private String trackPayloadJson;
    private int positionMs;
    private boolean isPlaying;
    private String lastUpdatedBy;
    private String lastUpdatedAt;
}