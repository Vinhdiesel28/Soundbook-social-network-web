package com.soundbook.service.admin;

import com.soundbook.dto.admin.response.*;
import com.soundbook.dto.common.response.*;

public interface AdminRoomService
{
    PageResponse<AdminRoomResponse> getAllRooms(String keyword, int page, int size);

    AdminRoomDetailResponse getRoomDetail(Long roomId);

    void endRoom(Long id);

    PageResponse<AdminRoomMemberResponse> getRoomMembers(Long roomId, int page, int size);

    void deleteRoomMessage(Long messageId);

    void kickAndBanMember(Long roomId, Long userId);

    PageResponse<AdminRoomMessageResponse> getRoomMessages(Long roomId, int page, int size);

    PageResponse<AdminRoomQueueResponse> getRoomQueue(Long roomId, int page, int size);

    void removeFromQueue(Long queueId);

}
