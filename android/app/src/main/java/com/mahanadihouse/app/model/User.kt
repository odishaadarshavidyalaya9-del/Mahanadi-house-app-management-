package com.mahanadihouse.app.model

data class User(
    val id: String,
    val fullName: String,
    val email: String,
    val mobileNumber: String,
    val role: Role,
    val classLevel: String,
    val section: String,
    val rollNumber: String,
    val dob: String, // YYYY-MM-DD
    val house: String = "Mahanadi House",
    val avatarUrl: String = "",
    val joinedDate: String = "2024-04-01",
    val bloodGroup: String = "O+",
    val isVerified: Boolean = true,
    val motto: String = "PRIDE BY MY SIDE"
)
