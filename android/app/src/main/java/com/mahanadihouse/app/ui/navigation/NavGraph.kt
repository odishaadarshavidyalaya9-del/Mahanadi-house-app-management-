package com.mahanadihouse.app.ui.navigation

import androidx.compose.foundation.layout.padding
import androidx.compose.material3.Scaffold
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavHostController
import androidx.navigation.NavType
import androidx.navigation.compose.*
import androidx.navigation.navArgument
import com.mahanadihouse.app.ui.components.MahanadiBottomBar
import com.mahanadihouse.app.ui.components.MahanadiTopBar
import com.mahanadihouse.app.ui.screens.attendance.AttendanceScreen
import com.mahanadihouse.app.ui.screens.auth.LoginSelectionScreen
import com.mahanadihouse.app.ui.screens.auth.MemberEntryScreen
import com.mahanadihouse.app.ui.screens.auth.RoleLoginScreen
import com.mahanadihouse.app.ui.screens.calls.ActiveCallScreen
import com.mahanadihouse.app.ui.screens.calls.CallsScreen
import com.mahanadihouse.app.ui.screens.chat.ChatScreen
import com.mahanadihouse.app.ui.screens.home.HomeScreen
import com.mahanadihouse.app.ui.screens.profile.ProfileScreen
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun AppNavGraph(
    navController: NavHostController,
    viewModel: HouseViewModel
) {
    val currentUser by viewModel.currentUser.collectAsState()
    val startDestination = if (currentUser != null) Screen.Home.route else Screen.LoginSelection.route

    NavHost(
        navController = navController,
        startDestination = startDestination
    ) {
        // 1. Login Entry Selection (Captain, House Teacher, Member, Coordinator)
        composable(Screen.LoginSelection.route) {
            LoginSelectionScreen(
                onSelectRoleLogin = { roleName ->
                    navController.navigate(Screen.RoleLogin.createRoute(roleName))
                },
                onJoinMemberClick = {
                    navController.navigate(Screen.MemberRegistration.route)
                }
            )
        }

        // 2. Role Login Screen (Email, Mobile OTP, Google)
        composable(
            route = Screen.RoleLogin.route,
            arguments = listOf(navArgument("roleName") { type = NavType.StringType })
        ) { backStackEntry ->
            val roleName = backStackEntry.arguments?.getString("roleName") ?: "HOUSE_MEMBER"
            RoleLoginScreen(
                roleName = roleName,
                viewModel = viewModel,
                onLoginSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.LoginSelection.route) { inclusive = true }
                    }
                },
                onBackClick = { navController.popBackStack() }
            )
        }

        // 3. Member Entry Form (Name, Class, Section, Roll No, DOB, House, Captcha)
        composable(Screen.MemberRegistration.route) {
            MemberEntryScreen(
                viewModel = viewModel,
                onSuccess = {
                    navController.navigate(Screen.Home.route) {
                        popUpTo(Screen.LoginSelection.route) { inclusive = true }
                    }
                },
                onBackClick = { navController.popBackStack() }
            )
        }

        // 4. Portal Main Shell with Bottom Navigation & TopBar
        composable(Screen.Home.route) {
            MainPortalShell(navController = navController, viewModel = viewModel, currentTab = Screen.Home)
        }
        composable(Screen.Attendance.route) {
            MainPortalShell(navController = navController, viewModel = viewModel, currentTab = Screen.Attendance)
        }
        composable(Screen.Chat.route) {
            MainPortalShell(navController = navController, viewModel = viewModel, currentTab = Screen.Chat)
        }
        composable(Screen.Calls.route) {
            MainPortalShell(navController = navController, viewModel = viewModel, currentTab = Screen.Calls)
        }
        composable(Screen.Profile.route) {
            MainPortalShell(navController = navController, viewModel = viewModel, currentTab = Screen.Profile)
        }

        // 5. Active Call Screen
        composable(Screen.ActiveCall.route) {
            ActiveCallScreen(
                viewModel = viewModel,
                onCallEnded = {
                    navController.popBackStack()
                }
            )
        }
    }
}

@Composable
fun MainPortalShell(
    navController: NavHostController,
    viewModel: HouseViewModel,
    currentTab: Screen
) {
    val currentUser by viewModel.currentUser.collectAsState()

    Scaffold(
        topBar = {
            MahanadiTopBar(
                currentUser = currentUser,
                onSwitchRoleClick = {
                    navController.navigate(Screen.Profile.route)
                }
            )
        },
        bottomBar = {
            MahanadiBottomBar(navController = navController)
        }
    ) { paddingValues ->
        androidx.compose.foundation.layout.Box(modifier = Modifier.padding(paddingValues)) {
            when (currentTab) {
                Screen.Home -> HomeScreen(
                    viewModel = viewModel,
                    onNavigateToAttendance = { navController.navigate(Screen.Attendance.route) },
                    onNavigateToChat = { navController.navigate(Screen.Chat.route) },
                    onNavigateToCalls = { navController.navigate(Screen.Calls.route) }
                )
                Screen.Attendance -> AttendanceScreen(viewModel = viewModel)
                Screen.Chat -> ChatScreen(viewModel = viewModel)
                Screen.Calls -> CallsScreen(
                    viewModel = viewModel,
                    onNavigateToActiveCall = { navController.navigate(Screen.ActiveCall.route) }
                )
                Screen.Profile -> ProfileScreen(
                    viewModel = viewModel,
                    onLogout = {
                        navController.navigate(Screen.LoginSelection.route) {
                            popUpTo(0) { inclusive = true }
                        }
                    }
                )
                else -> HomeScreen(
                    viewModel = viewModel,
                    onNavigateToAttendance = {},
                    onNavigateToChat = {},
                    onNavigateToCalls = {}
                )
            }
        }
    }
}
