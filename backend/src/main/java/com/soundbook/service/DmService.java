package com.soundbook.service;

import com.soundbook.dto.dm.*;

import java.util.List;

public interface DmService {
    DmThreadResponse upsertThread(DmThreadUpsertRequest request);

    DmCursorPageResponse<DmThreadResponse> getThreads(Long userId, String cursor, int limit);

    DmCursorPageResponse<DmMessageResponse> getThreadMessages(Long threadId, Long userId, String cursor, int limit);

    DmMessageResponse sendMessage(Long threadId, DmMessageSendRequest request);

    DmMessageResponse reactMessage(Long messageId, DmReactionRequest request);

    DmMessageResponse replyMessage(Long messageId, DmReplyRequest request);

    void deleteMessage(Long messageId, Long userId, String mode);

    DmMessageResponse shareToThread(Long threadId, DmShareRequest request);
}
