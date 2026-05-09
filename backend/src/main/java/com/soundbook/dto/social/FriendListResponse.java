package com.soundbook.dto.social;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class FriendListResponse {
    private List<FriendUserResponse> friends;
    private List<FriendUserResponse> incomingRequests;
    private List<FriendUserResponse> outgoingRequests;
    private List<FriendUserResponse> suggestions;
}
