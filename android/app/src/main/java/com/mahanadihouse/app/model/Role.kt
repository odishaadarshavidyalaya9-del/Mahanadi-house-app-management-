package com.mahanadihouse.app.model

enum class Role(
    val title: String,
    val canTakeAttendance: Boolean,
    val canPostAnnouncements: Boolean,
    val canManageActivities: Boolean,
    val canBroadcastChat: Boolean,
    val canModerateDiscipline: Boolean
) {
    HOUSE_CAPTAIN(
        title = "House Captain",
        canTakeAttendance = true,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = true,
        canModerateDiscipline = true
    ),
    VICE_CAPTAIN(
        title = "Vice Captain",
        canTakeAttendance = true,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = true,
        canModerateDiscipline = true
    ),
    HOUSE_TEACHER(
        title = "House Teacher",
        canTakeAttendance = true,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = true,
        canModerateDiscipline = true
    ),
    ATTENDANCE_COORDINATOR(
        title = "Attendance Coordinator",
        canTakeAttendance = true,
        canPostAnnouncements = false,
        canManageActivities = false,
        canBroadcastChat = false,
        canModerateDiscipline = false
    ),
    SPORTS_COORDINATOR(
        title = "Sports Coordinator",
        canTakeAttendance = false,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = false,
        canModerateDiscipline = false
    ),
    CULTURAL_COORDINATOR(
        title = "Cultural Coordinator",
        canTakeAttendance = false,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = false,
        canModerateDiscipline = false
    ),
    DISCIPLINE_COORDINATOR(
        title = "Discipline Coordinator",
        canTakeAttendance = true,
        canPostAnnouncements = false,
        canManageActivities = false,
        canBroadcastChat = false,
        canModerateDiscipline = true
    ),
    EVENT_COORDINATOR(
        title = "Event Coordinator",
        canTakeAttendance = false,
        canPostAnnouncements = true,
        canManageActivities = true,
        canBroadcastChat = false,
        canModerateDiscipline = false
    ),
    COMMUNICATION_COORDINATOR(
        title = "Communication Coordinator",
        canTakeAttendance = false,
        canPostAnnouncements = true,
        canManageActivities = false,
        canBroadcastChat = true,
        canModerateDiscipline = false
    ),
    HOUSE_MEMBER(
        title = "House Member",
        canTakeAttendance = false,
        canPostAnnouncements = false,
        canManageActivities = false,
        canBroadcastChat = false,
        canModerateDiscipline = false
    );

    val isLeadership: Boolean
        get() = this == HOUSE_CAPTAIN || this == VICE_CAPTAIN || this == HOUSE_TEACHER
}
