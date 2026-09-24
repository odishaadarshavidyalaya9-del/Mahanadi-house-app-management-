package com.mahanadihouse.app.ui.navigation

sealed class Screen(val route: String) {
    object LoginSelection : Screen("login_selection")
    object RoleLogin : Screen("role_login/{roleName}") {
        fun createRoute(roleName: String) = "role_login/$roleName"
    }
    object MemberRegistration : Screen("member_registration")
    
    // Bottom Nav Screens
    object Home : Screen("home")
    object Attendance : Screen("attendance")
    object Chat : Screen("chat")
    object Calls : Screen("calls")
    object Profile : Screen("profile")
    
    // Call In-Progress Overlay
    object ActiveCall : Screen("active_call")
}
