package com.soundbook.controller;

import com.soundbook.dto.room.RoomMessageResponse;
import com.soundbook.dto.room.RoomMessageSendRequest;
import com.soundbook.dto.room.RoomPlaybackStateResponse;
import com.soundbook.dto.room.RoomPlaybackUpdateRequest;
import com.soundbook.dto.room.RoomQueueAddRequest;
import com.soundbook.dto.room.RoomQueueItemResponse;
import com.soundbook.service.RoomService;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class RoomSocketController {

    private final RoomService roomService;

    /**
     * Chat message send via STOMP
     * Client sends to: /app/rooms/{roomId}/messages
     * Server broadcasts to: /topic/rooms/{roomId}/messages
     */
    @MessageMapping("/rooms/{roomId}/messages")
    @SendTo("/topic/rooms/{roomId}/messages")
    public RoomMessageResponse sendRoomMessage(
            @DestinationVariable Long roomId,
            RoomMessageSendRequest request) {
        return roomService.sendRoomMessage(roomId, request);
    }

    /**
     * Playback state update via STOMP
     * Client sends to: /app/rooms/{roomId}/playback
     * Server broadcasts to: /topic/rooms/{roomId}/playback
     */
    @MessageMapping("/rooms/{roomId}/playback")
    @SendTo("/topic/rooms/{roomId}/playback")
    public RoomPlaybackStateResponse updatePlayback(
            @DestinationVariable Long roomId,
            RoomPlaybackUpdateRequest request) {
        return roomService.updatePlaybackState(roomId, request);
    }

    /**
     * Queue item add via STOMP
     * Client sends to: /app/rooms/{roomId}/queue
     * Server broadcasts to: /topic/rooms/{roomId}/queue
     */
    @MessageMapping("/rooms/{roomId}/queue")
    @SendTo("/topic/rooms/{roomId}/queue")
    public RoomQueueItemResponse addQueueItem(
            @DestinationVariable Long roomId,
            RoomQueueAddRequest request) {
        return roomService.addToQueue(roomId, request);
    }

    /**
     * Queue item vote via STOMP
     * Client sends to: /app/rooms/{roomId}/queue/{queueItemId}/vote
     * Server broadcasts voted item
     */
    @MessageMapping("/rooms/{roomId}/queue/{queueItemId}/vote")
    @SendTo("/topic/rooms/{roomId}/queue/votes")
    public RoomQueueItemResponse voteQueueItem(
            @DestinationVariable Long roomId,
            @DestinationVariable Long queueItemId) {
        return roomService.voteQueueItem(queueItemId);
    }

    /**
     * Queue item remove via STOMP
     */
    @MessageMapping("/rooms/{roomId}/queue/{queueItemId}/remove")
    @SendTo("/topic/rooms/{roomId}/queue/remove")
    public Long removeQueueItem(
            @DestinationVariable Long roomId,
            @DestinationVariable Long queueItemId) {
        roomService.removeQueueItem(roomId, queueItemId);
        return queueItemId;
    }

}
