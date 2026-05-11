package com.soundbook.service.impl;

import com.soundbook.dto.common.response.PageResponse;
import com.soundbook.dto.socialcontent.ReactionResponse;
import com.soundbook.entity.Reaction;
import com.soundbook.entity.User;
import com.soundbook.repository.ReactionRepository;
import com.soundbook.service.ReactionService;
import com.soundbook.utils.PageMapper;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ReactionServiceImpl implements ReactionService
{
    private final ReactionRepository reactionRepository;

    @Override
    @Transactional
    public PageResponse<ReactionResponse> getReactionsByTargetId(Long targetId, com.soundbook.entity.enums.TargetType targetType, int page, int size)
    {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));

        Page<Reaction> reactionPage = reactionRepository.findByTargetIdAndTargetType(targetId, targetType, pageable);

        Page<ReactionResponse> responsePage = reactionPage.map(this::mapToResponse);

        return PageMapper.toPageResponse(responsePage);
    }

    private ReactionResponse mapToResponse(Reaction reaction) {
        User user = reaction.getUser();
        String avatar = (user.getProfile() != null) ? user.getProfile().getAvatarUrl() : null;
        String name = user.getDisplayName();

        return ReactionResponse.builder()
                .reactionId(reaction.getId())
                .reactionType(reaction.getReactionType().name())
                .userId(user.getId())
                .fullName(name)
                .avatarUrl(avatar)
                .createdAt(reaction.getCreatedAt())
                .build();
    }
}
