package com.mahanadihouse.app.ui.components

import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.navigation.NavController
import androidx.navigation.compose.currentBackStackEntryAsState
import com.mahanadihouse.app.ui.navigation.Screen
import com.mahanadihouse.app.ui.theme.NavyPrimary
import com.mahanadihouse.app.ui.theme.SunGold

data class BottomNavItem(
    val title: String,
    val route: String,
    val icon: ImageVector
)

@Composable
fun MahanadiBottomBar(navController: NavController) {
    val items = listOf(
        BottomNavItem("Home", Screen.Home.route, Icons.Default.Home),
        BottomNavItem("Attendance", Screen.Attendance.route, Icons.Default.EventAvailable),
        BottomNavItem("Chat", Screen.Chat.route, Icons.Default.ChatBubble),
        BottomNavItem("Calls", Screen.Calls.route, Icons.Default.Call),
        BottomNavItem("Profile", Screen.Profile.route, Icons.Default.Person)
    )

    val navBackStackEntry = navController.currentBackStackEntryAsState()
    val currentRoute = navBackStackEntry.value?.destination?.route

    NavigationBar(
        containerColor = NavyPrimary,
        contentColor = Color.White
    ) {
        items.forEach { item ->
            val isSelected = currentRoute == item.route
            NavigationBarItem(
                icon = {
                    Icon(
                        imageVector = item.icon,
                        contentDescription = item.title,
                        tint = if (isSelected) SunGold else Color.White.copy(alpha = 0.65f)
                    )
                },
                label = {
                    Text(
                        text = item.title,
                        color = if (isSelected) SunGold else Color.White.copy(alpha = 0.65f),
                        style = MaterialTheme.typography.labelSmall
                    )
                },
                selected = isSelected,
                onClick = {
                    if (currentRoute != item.route) {
                        navController.navigate(item.route) {
                            popUpTo(Screen.Home.route) { saveState = true }
                            launchSingleTop = true
                            restoreState = true
                        }
                    }
                },
                colors = NavigationBarItemDefaults.colors(
                    indicatorColor = Color.White.copy(alpha = 0.15f)
                )
            )
        }
    }
}
