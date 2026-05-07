package com.soundbook.service.admin.impl;

import com.soundbook.common.exception.AppException;
import com.soundbook.common.exception.ErrorCode;
import com.soundbook.dto.response.AdminDmMessageResponse;
import com.soundbook.dto.response.AdminDmThreadResponse;
import com.soundbook.dto.response.PageResponse;
import com.soundbook.entity.DmMessage;
import com.soundbook.entity.DmThread;
import com.soundbook.repository.DmMessageRepository;
import com.soundbook.repository.DmThreadRepository;
import com.soundbook.service.admin.AdminDmService;
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
public class AdminDmServiceImpl implements AdminDmService
{
    private final DmThreadRepository dmThreadRepository;
    private final DmMessageRepository dmMessageRepository;

    public PageResponse<AdminDmThreadResponse> getAllThreads(String keyword, int page, int size)
    {
        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("updatedAt").descending());
        Page<DmThread> threadPage = dmThreadRepository.searchThreadsWithUsers(keyword, pageable);

        Page<AdminDmThreadResponse> responsePage = threadPage.map(thread -> AdminDmThreadResponse.builder()
                .id(thread.getId())
                .user1Id(thread.getUser1().getId())
                .user1Name(thread.getUser1().getDisplayName())
                .user2Id(thread.getUser2().getId())
                .user2Name(thread.getUser2().getDisplayName())
                .createdAt(thread.getCreatedAt())
                .updatedAt(thread.getUpdatedAt())
                .build());

        return PageMapper.toPageResponse(responsePage);
    }

    public PageResponse<AdminDmMessageResponse> getThreadMessages(Long threadId, int page, int size)
    {
        if (!dmThreadRepository.existsById(threadId))
        {
            throw new AppException(ErrorCode.THREAD_NOT_FOUND);
        }

        Pageable pageable = PageRequest.of(page - 1, size, Sort.by("createdAt").descending());
        Page<DmMessage> messagePage = dmMessageRepository.findByThreadId(threadId, pageable);

        Page<AdminDmMessageResponse> responsePage = messagePage.map(msg -> AdminDmMessageResponse.builder()
                .id(msg.getId())
                .threadId(msg.getThread().getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getDisplayName())
                .messageType(msg.getMessageType())
                .contentText(msg.getContentText())
                .cardPayloadJson(msg.getCardPayloadJson())
                .replyToMessageId(msg.getReplyToMessage() != null ? msg.getReplyToMessage().getId() : null)
                .deletedForEveryone(msg.getDeletedForEveryone())
                .createdAt(msg.getCreatedAt())
                .build());

        return PageMapper.toPageResponse(responsePage);
    }

    @Transactional
    public void deleteMessageHard(Long messageId)
    {
        if (!dmMessageRepository.existsById(messageId))
        {
            throw new AppException(ErrorCode.MESSAGE_NOT_FOUND);
        }
        dmMessageRepository.deleteById(messageId);
    }

    @Transactional
    public void deleteMessageForEveryone(Long messageId)
    {
        DmMessage message = dmMessageRepository.findById(messageId)
                .orElseThrow(() -> new AppException(ErrorCode.MESSAGE_NOT_FOUND));

        message.setDeletedForEveryone(true);
        dmMessageRepository.save(message);
    }
}
