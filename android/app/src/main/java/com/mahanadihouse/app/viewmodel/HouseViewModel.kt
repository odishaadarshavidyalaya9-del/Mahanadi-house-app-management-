package com.mahanadihouse.app.viewmodel

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import com.mahanadihouse.app.data.HouseRepository
import com.mahanadihouse.app.model.*
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import java.text.SimpleDateFormat
import java.util.*

class HouseViewModel(
    private val repository: HouseRepository = HouseRepository.instance
) : ViewModel() {

    val users: StateFlow<List<User>> = repository.users
    val currentUser: StateFlow<User?> = repository.currentUser
    val announcements: StateFlow<List<Announcement>> = repository.announcements
    val activities: StateFlow<List<HouseActivity>> = repository.activities
    val chatMessages: StateFlow<List<ChatMessage>> = repository.chatMessages
    val attendanceByDate: StateFlow<Map<String, DayAttendance>> = repository.attendanceByDate
    val activeCall: StateFlow<CallSession?> = repository.activeCall

    fun selectUser(userId: String) {
        repository.switchUser(userId)
    }

    fun loginWithEmail(email: String): Boolean {
        return repository.loginWithEmail(email)
    }

    fun loginWithMobileOtp(mobile: String): Boolean {
        return repository.loginWithMobileOtp(mobile)
    }

    fun loginWithRole(role: Role) {
        repository.loginWithRole(role)
    }

    fun registerMember(
        fullName: String,
        classLevel: String,
        section: String,
        rollNumber: String,
        dob: String,
        email: String,
        mobileNumber: String
    ) {
        repository.registerMember(
            fullName,
            classLevel,
            section,
            rollNumber,
            dob,
            email,
            mobileNumber
        )
    }

    fun markAttendance(date: String, memberId: String, isPresent: Boolean, remarks: String = "") {
        repository.markAttendance(date, memberId, isPresent, remarks)
    }

    fun sendChatMessage(channel: ChatChannel, text: String, recipientId: String? = null) {
        repository.sendChatMessage(channel, text, recipientId)
    }

    fun startCall(type: CallType, targetName: String, isVideo: Boolean, roomCode: String = "") {
        repository.startCall(type, targetName, isVideo, roomCode)
    }

    fun endCall() {
        repository.endCall()
    }

    fun toggleMute() {
        repository.toggleMute()
    }

    fun toggleVideo() {
        repository.toggleVideo()
    }

    fun postAnnouncement(title: String, desc: String, category: String) {
        repository.postAnnouncement(title, desc, category)
    }

    fun toggleActivity(activityId: String) {
        repository.toggleActivityParticipation(activityId)
    }

    fun logout() {
        repository.logout()
    }

    fun getTodayDate(): String {
        return SimpleDateFormat("yyyy-MM-dd", Locale.getDefault()).format(Date())
    }
}
