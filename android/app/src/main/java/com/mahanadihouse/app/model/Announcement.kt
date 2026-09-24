package com.mahanadihouse.app.model

data class Announcement(
    val id: String,
    val title: String,
    val description: String,
    val date: String,
    val authorName: String,
    val authorRole: Role,
    val category: String,
    val isPinned: Boolean = false,
    val attachmentName: String? = null
)

data class HouseActivity(
    val id: String,
    val title: String,
    val description: String,
    val date: String,
    val time: String,
    val location: String,
    val category: String,
    val pointsAwarded: Int,
    val participantsCount: Int = 0,
    val isUserParticipating: Boolean = false
)
