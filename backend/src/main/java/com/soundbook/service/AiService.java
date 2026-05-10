package com.soundbook.service;

import org.springframework.web.reactive.function.client.WebClient;

public interface AiService
{
    String getPostInsight(Long postId);

    String chatWithPost(Long postId, String userMessage);
}
