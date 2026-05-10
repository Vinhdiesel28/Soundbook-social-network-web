package com.soundbook.service.admin;

import com.soundbook.dto.admin.response.AdminDmMessageResponse;
import com.soundbook.dto.admin.response.AdminDmThreadResponse;
import com.soundbook.dto.common.response.PageResponse;

public interface AdminDmService
{
    PageResponse<AdminDmThreadResponse> getAllThreads(String keyword, int page, int size);

    PageResponse<AdminDmMessageResponse> getThreadMessages(Long threadId, int page, int size);

    void deleteMessageHard(Long messageId);

    void deleteMessageForEveryone(Long messageId);
}
