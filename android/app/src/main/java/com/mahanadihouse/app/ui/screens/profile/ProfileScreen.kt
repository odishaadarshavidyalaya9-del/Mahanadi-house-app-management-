package com.mahanadihouse.app.ui.screens.profile

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahanadihouse.app.ui.components.MahanadiLogoView
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun ProfileScreen(
    viewModel: HouseViewModel,
    onLogout: () -> Unit
) {
    val currentUser by viewModel.currentUser.collectAsState()
    val users by viewModel.users.collectAsState()

    var showAccountSwitcher by remember { mutableStateOf(false) }

    if (currentUser == null) {
        LaunchedEffect(Unit) { onLogout() }
        return
    }

    val user = currentUser!!

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Student ID Card Style Profile Header
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(22.dp),
                colors = CardDefaults.cardColors(containerColor = NavyPrimary)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    horizontalAlignment = Alignment.CenterHorizontally
                ) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        MahanadiLogoView(size = 36.dp, showText = true, textColor = Color.White)

                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = SunGold
                        ) {
                            Text(
                                text = "OFFICIAL PASS",
                                color = NavyDark,
                                fontSize = 9.sp,
                                fontWeight = FontWeight.Black,
                                modifier = Modifier.padding(horizontal = 6.dp, vertical = 3.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(18.dp))

                    // Avatar Circle
                    Box(
                        modifier = Modifier
                            .size(76.dp)
                            .background(SunGold.copy(alpha = 0.2f), CircleShape),
                        contentAlignment = Alignment.Center
                    ) {
                        Icon(
                            imageVector = Icons.Default.Person,
                            contentDescription = null,
                            tint = SunGold,
                            modifier = Modifier.size(44.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Text(
                        text = user.fullName,
                        color = Color.White,
                        fontSize = 20.sp,
                        fontWeight = FontWeight.Black
                    )

                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = AzureBlue.copy(alpha = 0.25f),
                        modifier = Modifier.padding(top = 6.dp)
                    ) {
                        Text(
                            text = user.role.title,
                            color = SunGold,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold,
                            modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                        )
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Creed / Motto Banner
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color.White.copy(alpha = 0.1f),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "\"${user.motto}\"",
                            color = Color.White.copy(alpha = 0.9f),
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Medium,
                            modifier = Modifier.padding(12.dp)
                        )
                    }
                }
            }
        }

        // 2. Member Information Grid
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp)
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp)
                ) {
                    Text(
                        text = "MEMBER DETAILS",
                        color = NavyPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )

                    DetailRow(label = "House", value = user.house, highlight = true)
                    DetailRow(label = "Class & Section", value = "${user.classLevel} - ${user.section}")
                    DetailRow(label = "Roll Number", value = user.rollNumber)
                    DetailRow(label = "Date of Birth", value = user.dob)
                    DetailRow(label = "Email", value = user.email)
                    DetailRow(label = "Mobile", value = user.mobileNumber)
                }
            }
        }

        // 3. House Creed & Values
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.Verified, contentDescription = null, tint = SunGoldAmber)
                        Text(
                            text = "HOUSE CREED",
                            color = NavyPrimary,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )
                    }
                    Spacer(modifier = Modifier.height(8.dp))
                    Text(
                        text = "We, the proud students of Mahanadi House, pledge to uphold honour, integrity, and sportsmanship on every ground. Flowing with resilience like the sacred river Mahanadi, we carry pride by our side in learning, leading, and serving our alma mater.",
                        color = TextSecondaryLight,
                        fontSize = 12.sp,
                        lineHeight = 18.sp
                    )
                }
            }
        }

        // 4. Role Permissions Overview
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.5.dp)
            ) {
                Column(
                    modifier = Modifier.padding(18.dp),
                    verticalArrangement = Arrangement.spacedBy(10.dp)
                ) {
                    Text(
                        text = "ROLE PERMISSIONS FOR ${user.role.title.uppercase()}",
                        color = NavyPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 0.5.sp
                    )

                    PermissionCheckRow("Take & Save House Attendance", user.role.canTakeAttendance)
                    PermissionCheckRow("Broadcast Official Notices", user.role.canPostAnnouncements)
                    PermissionCheckRow("Manage House Activities", user.role.canManageActivities)
                    PermissionCheckRow("Broadcast in Chat Channels", user.role.canBroadcastChat)
                    PermissionCheckRow("Discipline & Moderation", user.role.canModerateDiscipline)
                }
            }
        }

        // 5. Account Switcher & Logout
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.spacedBy(10.dp)
            ) {
                OutlinedButton(
                    onClick = { showAccountSwitcher = true },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp)
                ) {
                    Icon(Icons.Default.SwapHoriz, contentDescription = null, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Switch Role", fontWeight = FontWeight.Bold)
                }

                Button(
                    onClick = {
                        viewModel.logout()
                        onLogout()
                    },
                    modifier = Modifier.weight(1f).height(48.dp),
                    shape = RoundedCornerShape(12.dp),
                    colors = ButtonDefaults.buttonColors(containerColor = Color(0xFFEF4444))
                ) {
                    Icon(Icons.Default.Logout, contentDescription = null, tint = Color.White, modifier = Modifier.size(18.dp))
                    Spacer(modifier = Modifier.width(6.dp))
                    Text("Logout", fontWeight = FontWeight.Bold, color = Color.White)
                }
            }
        }
    }

    // Role Switcher Dialog for Fast Demo Testing of All 10 Roles
    if (showAccountSwitcher) {
        AlertDialog(
            onDismissRequest = { showAccountSwitcher = false },
            title = { Text("Switch Demo User / Role", fontWeight = FontWeight.Bold) },
            text = {
                LazyColumn(modifier = Modifier.height(300.dp)) {
                    items(users) { u ->
                        TextButton(
                            onClick = {
                                viewModel.selectUser(u.id)
                                showAccountSwitcher = false
                            },
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Row(
                                modifier = Modifier.fillMaxWidth(),
                                horizontalArrangement = Arrangement.SpaceBetween,
                                verticalAlignment = Alignment.CenterVertically
                            ) {
                                Column {
                                    Text(u.fullName, fontWeight = FontWeight.Bold, color = NavyPrimary)
                                    Text(u.role.title, fontSize = 11.sp, color = TextSecondaryLight)
                                }
                                if (u.id == user.id) {
                                    Text("✓ Active", color = Color(0xFF10B981), fontWeight = FontWeight.Bold)
                                }
                            }
                        }
                    }
                }
            },
            confirmButton = {
                TextButton(onClick = { showAccountSwitcher = false }) {
                    Text("Close")
                }
            }
        )
    }
}

@Composable
private fun DetailRow(label: String, value: String, highlight: Boolean = false) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = label, color = TextSecondaryLight, fontSize = 13.sp)
        Text(
            text = value,
            color = if (highlight) SunGoldAmber else TextPrimaryLight,
            fontSize = 13.sp,
            fontWeight = FontWeight.Bold
        )
    }
}

@Composable
private fun PermissionCheckRow(title: String, granted: Boolean) {
    Row(
        modifier = Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically
    ) {
        Text(text = title, fontSize = 12.sp, color = TextPrimaryLight)
        Surface(
            shape = RoundedCornerShape(6.dp),
            color = if (granted) Color(0xFFD1FAE5) else Color(0xFFF1F5F9)
        ) {
            Text(
                text = if (granted) "GRANTEE ✓" else "DISABLED",
                color = if (granted) Color(0xFF065F46) else Color(0xFF94A3B8),
                fontSize = 10.sp,
                fontWeight = FontWeight.Bold,
                modifier = Modifier.padding(horizontal = 6.dp, vertical = 2.dp)
            )
        }
    }
}
