package com.soundbook.controller;

import com.soundbook.dto.dm.DmMessageResponse;
import com.soundbook.dto.dm.DmMessageSendRequest;
import com.soundbook.dto.dm.DmReactionRequest;
import com.soundbook.dto.dm.DmReplyRequest;
import com.soundbook.dto.dm.DmShareRequest;
import com.soundbook.service.DmService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class DmSocketController {

    private final DmService dmService;

    @MessageMapping("/dm/threads/{threadId}/messages")
    public void sendMessage(
            @DestinationVariable Long threadId,
            DmMessageSendRequest request) {
        dmService.sendMessage(threadId, request);
    }

    @MessageMapping("/dm/messages/{messageId}/reaction")
    public void reactMessage(
            @DestinationVariable Long messageId,
            DmReactionRequest request) {
        dmService.reactMessage(messageId, request);
    }

    @MessageMapping("/dm/messages/{messageId}/reply")
    public void replyMessage(
            @DestinationVariable Long messageId,
            DmReplyRequest request) {
        dmService.replyMessage(messageId, request);
    }

    @MessageMapping("/dm/threads/{threadId}/share")
    public void shareToThread(
            @DestinationVariable Long threadId,
            DmShareRequest request) {
        dmService.shareToThread(threadId, request);
    }
}