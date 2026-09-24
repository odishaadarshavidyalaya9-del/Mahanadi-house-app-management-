package com.mahanadihouse.app.model

data class AttendanceRecord(
    val memberId: String,
    val memberName: String,
    val memberRoll: String,
    val memberClass: String,
    val isPresent: Boolean,
    val remarks: String = "",
    val markedBy: String = "",
    val markedByName: String = "",
    val timestamp: String = ""
)

data class DayAttendance(
    val date: String, // YYYY-MM-DD
    val records: Map<String, AttendanceRecord>,
    val lastUpdatedBy: String,
    val lastUpdatedByName: String,
    val timestamp: String
)
