package com.soundbook.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AdminRoomQueueResponse
{
    private Long id;
    private String trackId;
    private String trackPayloadJson;
    private Long addedById;
    private String addedByName;
    private int voteCount;
    private int positionOrder;
    private LocalDateTime createdAt;
}