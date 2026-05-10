package com.soundbook.dto.search;

import com.soundbook.dto.feed.FeedPostResponse;
import com.soundbook.dto.social.FriendUserResponse;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SearchResponse {
    private String query;
    private List<FriendUserResponse> users;
    private List<FeedPostResponse> posts;
    private List<SearchShelfItemResponse> music;
    private List<SearchShelfItemResponse> books;
}
