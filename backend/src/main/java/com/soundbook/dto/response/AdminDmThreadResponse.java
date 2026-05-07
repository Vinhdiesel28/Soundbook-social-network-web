package com.soundbook.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class AdminDmThreadResponse
{
    private Long id;
    private Long user1Id;
    private String user1Name;
    private Long user2Id;
    private String user2Name;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}