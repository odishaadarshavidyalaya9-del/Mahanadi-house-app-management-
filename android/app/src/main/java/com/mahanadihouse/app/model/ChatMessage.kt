package com.mahanadihouse.app.model

enum class ChatChannel {
    HOUSE_GROUP,
    OFFICIAL_ANNOUNCEMENTS,
    DIRECT
}

data class ChatMessage(
    val id: String,
    val channel: ChatChannel,
    val senderId: String,
    val senderName: String,
    val senderRole: Role,
    val senderClass: String = "",
    val text: String,
    val timestamp: String,
    val recipientId: String? = null
)

enum class CallType {
    JOIN_CALL,
    MEMBER_CALL,
    TEACHER_CAPTAIN_CALL
}

enum class CallStatus {
    IDLE,
    CALLING,
    CONNECTED,
    ENDED
}

data class CallSession(
    val id: String,
    val type: CallType,
    val title: String,
    val roomCode: String,
    val callerName: String,
    val targetName: String,
    val status: CallStatus,
    val isVideo: Boolean,
    val isMuted: Boolean = false,
    val isVideoOff: Boolean = false,
    val durationSeconds: Int = 0
)
