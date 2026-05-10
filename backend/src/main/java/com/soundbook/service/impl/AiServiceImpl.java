package com.soundbook.service.impl;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.ai.Content;
import com.soundbook.dto.ai.GeminiRequest;
import com.soundbook.dto.ai.GenerationConfig;
import com.soundbook.dto.ai.Part;
import com.soundbook.entity.Post;
import com.soundbook.repository.PostRepository;
import com.soundbook.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AiServiceImpl implements AiService
{
    @Value("${gemini.api-key}")
    private String apiKey;

    private final PostRepository postRepository;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;

    @Autowired
    public AiServiceImpl(WebClient.Builder webClientBuilder,
                         ObjectMapper objectMapper,
                         PostRepository postRepository) {
        this.webClient = webClientBuilder.baseUrl("https://generativelanguage.googleapis.com/v1beta/models").build();
        this.objectMapper = objectMapper;
        this.postRepository = postRepository;
    }

    @Override
    public String getPostInsight(Long postId)
    {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        String prompt = buildSuperPrompt(post);

        return callGemini(prompt, 0.9);
    }

    @Override
    public String chatWithPost(Long postId, String userMessage)
    {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new AppException(ErrorCode.POST_NOT_FOUND));

        String prompt = String.format(
                "Dựa trên nội dung bài viết: '%s'. Hãy trả lời câu hỏi của người dùng như một chatbot thân thiện: '%s'",
                post.getCaption(), userMessage
        );

        return callGemini(prompt, 0.7);
    }

    public String callGemini(String prompt, Double temperature)
    {
        Part part = new Part(prompt);

        Content content = new Content(List.of(part));

        GenerationConfig config = GenerationConfig.builder()
                .temperature(temperature)
                .maxOutputTokens(1000)
                .build();

        GeminiRequest request = GeminiRequest.builder()
                .contents(List.of(content))
                .generationConfig(config)
                .build();

        try {
            String responseJson = webClient.post()
                    .uri(uriBuilder -> uriBuilder
                            .path("/gemini-2.5-flash:generateContent")
                            .queryParam("key", apiKey)
                            .build())
                    .bodyValue(request)
                    .retrieve()
                    .bodyToMono(String.class)
                    .block();

            JsonNode root = objectMapper.readTree(responseJson);
            return root.path("candidates")
                    .get(0)
                    .path("content")
                    .path("parts")
                    .get(0)
                    .path("text")
                    .asText();

        } catch (Exception e) {
            return "AI Soundbook đang bận suy nghĩ về một bản nhạc hay hơn. Thử lại sau nhé!";
        }
    }

    private String buildSuperPrompt(Post post)
    {
        return String.format(
                "Bạn là trợ lý AI của Soundbook. Bài viết thuộc loại: %s. " +
                        "Nội dung: %s. Thông tin đính kèm (Sách/Nhạc): %s. " +
                        "Hãy: 1. Tóm tắt sáng tạo (đổi phong cách mỗi lần). " +
                        "2. Gợi ý 2 link liên quan (Tiki/Spotify/Youtube/Wiki). " +
                        "3. Chào mời người dùng chat về nội dung này.",
                post.getType(), post.getCaption(), post.getRefJson()
        );
    }
}
