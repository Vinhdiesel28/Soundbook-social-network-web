package com.soundbook.entity;

import com.soundbook.entity.enums.MessageType;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "dm_messages")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DmMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "thread_id", nullable = false)
    private DmThread thread;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Enumerated(EnumType.STRING)
    @Column(name = "message_type", nullable = false)
    @Builder.Default
    private MessageType messageType = MessageType.TEXT;

    @Column(name = "content_text", columnDefinition = "TEXT")
    private String contentText;

    @Column(name = "card_payload_json", columnDefinition = "JSON")
    private String cardPayloadJson;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "reply_to_message_id")
    private DmMessage replyToMessage;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "seen_at")
    private LocalDateTime seenAt;

    @Column(name = "deleted_for_sender", nullable = false)
    @Builder.Default
    private Boolean deletedForSender = false;

    @Column(name = "deleted_for_receiver", nullable = false)
    @Builder.Default
    private Boolean deletedForReceiver = false;

    @Column(name = "deleted_for_everyone", nullable = false)
    @Builder.Default
    private Boolean deletedForEveryone = false;

    @CreationTimestamp
    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;
}
