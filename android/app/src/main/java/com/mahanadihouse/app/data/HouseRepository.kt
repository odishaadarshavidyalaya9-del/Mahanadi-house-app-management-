package com.mahanadihouse.app.data

import com.mahanadihouse.app.model.*
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import java.text.SimpleDateFormat
import java.util.*

class HouseRepository {
    private val _users = MutableStateFlow<List<User>>(MockData.users)
    val users: StateFlow<List<User>> = _users.asStateFlow()

    // Default to Captain on first launch for demo testing, switchable anytime
    private val _currentUser = MutableStateFlow<User?>(MockData.users.firstOrNull { it.role == Role.HOUSE_CAPTAIN })
    val currentUser: StateFlow<User?> = _currentUser.asStateFlow()

    private val _announcements = MutableStateFlow<List<Announcement>>(MockData.announcements)
    val announcements: StateFlow<List<Announcement>> = _announcements.asStateFlow()

    private val _activities = MutableStateFlow<List<HouseActivity>>(MockData.activities)
    val activities: StateFlow<List<HouseActivity>> = _activities.asStateFlow()

    private val _chatMessages = MutableStateFlow<List<ChatMessage>>(MockData.initialChatMessages)
    val chatMessages: StateFlow<List<ChatMessage>> = _chatMessages.asStateFlow()

    // Attendance mapped by date YYYY-MM-DD
    private val _attendanceByDate = MutableStateFlow<Map<String, DayAttendance>>(emptyMap())
    val attendanceByDate: StateFlow<Map<String, DayAttendance>> = _attendanceByDate.asStateFlow()

    private val _activeCall = MutableStateFlow<CallSession?>(null)
    val activeCall: StateFlow<CallSession?> = _activeCall.asStateFlow()

    init {
        // Pre-fill today's attendance records with default presence
        val today = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
        val defaultRecords = MockData.users.associate { user ->
            user.id to AttendanceRecord(
                memberId = user.id,
                memberName = user.fullName,
                memberRoll = user.rollNumber,
                memberClass = "${user.classLevel} ${user.section}".trim(),
                isPresent = true,
                remarks = "Present for Zero Period Roll Call"
            )
        }
        _attendanceByDate.value = mapOf(
            today to DayAttendance(
                date = today,
                records = defaultRecords,
                lastUpdatedBy = "usr-captain",
                lastUpdatedByName = "Rohan Verma",
                timestamp = "07:55 AM"
            )
        )
    }

    fun switchUser(userId: String) {
        val user = _users.value.find { it.id == userId }
        if (user != null) {
            _currentUser.value = user
        }
    }

    fun loginWithEmail(email: String): Boolean {
        val user = _users.value.find { it.email.equals(email.trim(), ignoreCase = true) }
        return if (user != null) {
            _currentUser.value = user
            true
        } else {
            false
        }
    }

    fun loginWithMobileOtp(mobile: String): Boolean {
        val clean = mobile.replace("\\s+".toRegex(), "")
        val user = _users.value.find { it.mobileNumber.replace("\\s+".toRegex(), "").contains(clean) }
            ?: _users.value.first()
        _currentUser.value = user
        return true
    }

    fun loginWithRole(role: Role) {
        val user = _users.value.find { it.role == role } ?: _users.value.first()
        _currentUser.value = user
    }

    fun registerMember(
        fullName: String,
        classLevel: String,
        section: String,
        rollNumber: String,
        dob: String,
        email: String,
        mobileNumber: String
    ): User {
        val newUser = User(
            id = "usr-mem-" + System.currentTimeMillis(),
            fullName = fullName.trim(),
            email = email.trim(),
            mobileNumber = mobileNumber.trim(),
            role = Role.HOUSE_MEMBER,
            classLevel = classLevel.trim(),
            section = section.trim().uppercase(),
            rollNumber = rollNumber.trim(),
            dob = dob.trim(),
            house = "Mahanadi House",
            motto = "Pride By My Side"
        )
        _users.value = _users.value + newUser
        _currentUser.value = newUser
        return newUser
    }

    fun markAttendance(date: String, memberId: String, isPresent: Boolean, remarks: String = "") {
        val user = _currentUser.value ?: return
        if (!user.role.canTakeAttendance) return

        val currentMap = _attendanceByDate.value.toMutableMap()
        val dayData = currentMap[date] ?: DayAttendance(
            date = date,
            records = emptyMap(),
            lastUpdatedBy = user.id,
            lastUpdatedByName = user.fullName,
            timestamp = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        )

        val targetMember = _users.value.find { it.id == memberId } ?: return
        val currentRecords = dayData.records.toMutableMap()
        currentRecords[memberId] = AttendanceRecord(
            memberId = memberId,
            memberName = targetMember.fullName,
            memberRoll = targetMember.rollNumber,
            memberClass = "${targetMember.classLevel} ${targetMember.section}".trim(),
            isPresent = isPresent,
            remarks = remarks,
            markedBy = user.id,
            markedByName = user.fullName,
            timestamp = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        )

        currentMap[date] = dayData.copy(
            records = currentRecords,
            lastUpdatedBy = user.id,
            lastUpdatedByName = user.fullName,
            timestamp = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date())
        )
        _attendanceByDate.value = currentMap
    }

    fun sendChatMessage(channel: ChatChannel, text: String, recipientId: String? = null) {
        val user = _currentUser.value ?: return
        if (text.isBlank()) return

        // Guard: only permitted leadership/coordinators can post to official broadcast
        if (channel == ChatChannel.OFFICIAL_ANNOUNCEMENTS && !user.role.canBroadcastChat) {
            return
        }

        val newMsg = ChatMessage(
            id = "msg-" + System.currentTimeMillis(),
            channel = channel,
            senderId = user.id,
            senderName = user.fullName,
            senderRole = user.role,
            senderClass = "${user.classLevel} ${user.section}".trim(),
            text = text.trim(),
            timestamp = SimpleDateFormat("hh:mm a", Locale.getDefault()).format(Date()),
            recipientId = recipientId
        )
        _chatMessages.value = _chatMessages.value + newMsg
    }

    fun startCall(type: CallType, targetName: String, isVideo: Boolean, roomCode: String = "") {
        val user = _currentUser.value ?: return
        val code = if (roomCode.isNotBlank()) roomCode else "MAH-" + (1000..9999).random()
        val title = when (type) {
            CallType.JOIN_CALL -> "Mahanadi House Video Meeting ($code)"
            CallType.TEACHER_CAPTAIN_CALL -> "Teacher & Captain Direct Line"
            CallType.MEMBER_CALL -> "House Peer Call with $targetName"
        }

        _activeCall.value = CallSession(
            id = "call-" + System.currentTimeMillis(),
            type = type,
            title = title,
            roomCode = code,
            callerName = user.fullName,
            targetName = targetName,
            status = CallStatus.CONNECTED,
            isVideo = isVideo,
            isMuted = false,
            isVideoOff = false,
            durationSeconds = 0
        )
    }

    fun endCall() {
        _activeCall.value = null
    }

    fun toggleMute() {
        val call = _activeCall.value ?: return
        _activeCall.value = call.copy(isMuted = !call.isMuted)
    }

    fun toggleVideo() {
        val call = _activeCall.value ?: return
        _activeCall.value = call.copy(isVideoOff = !call.isVideoOff)
    }

    fun postAnnouncement(title: String, description: String, category: String) {
        val user = _currentUser.value ?: return
        if (!user.role.canPostAnnouncements) return

        val newAnc = Announcement(
            id = "anc-" + System.currentTimeMillis(),
            title = title.trim(),
            description = description.trim(),
            date = "Just now",
            authorName = user.fullName,
            authorRole = user.role,
            category = category.uppercase(),
            isPinned = false
        )
        _announcements.value = listOf(newAnc) + _announcements.value
    }

    fun toggleActivityParticipation(activityId: String) {
        _activities.value = _activities.value.map { act ->
            if (act.id == activityId) {
                val nowParticipating = !act.isUserParticipating
                act.copy(
                    isUserParticipating = nowParticipating,
                    participantsCount = if (nowParticipating) act.participantsCount + 1 else (act.participantsCount - 1).coerceAtLeast(0)
                )
            } else act
        }
    }

    fun logout() {
        _currentUser.value = null
    }

    companion object {
        val instance = HouseRepository()
    }
}
