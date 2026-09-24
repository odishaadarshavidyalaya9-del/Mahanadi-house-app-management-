package com.mahanadihouse.app.ui.screens.calls

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
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
import com.mahanadihouse.app.model.CallType
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun CallsScreen(
    viewModel: HouseViewModel,
    onNavigateToActiveCall: () -> Unit
) {
    val currentUser by viewModel.currentUser.collectAsState()
    val users by viewModel.users.collectAsState()

    var roomCodeInput by remember { mutableStateOf("") }
    val otherMembers = users.filter { it.id != currentUser?.id }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(16.dp)
    ) {
        // 1. Join Existing House Call / Meeting Room
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = NavyPrimary)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.VideoCall, contentDescription = null, tint = SunGold)
                        Text(
                            text = "JOIN HOUSE VIDEO MEETING",
                            color = Color.White,
                            fontWeight = FontWeight.Black,
                            fontSize = 13.sp,
                            letterSpacing = 0.5.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(10.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        OutlinedTextField(
                            value = roomCodeInput,
                            onValueChange = { roomCodeInput = it },
                            placeholder = { Text("Enter 4-digit code (e.g. MAH-4821)", color = Color.White.copy(alpha = 0.6f), fontSize = 12.sp) },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true,
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = Color.White,
                                unfocusedTextColor = Color.White,
                                focusedBorderColor = SunGold,
                                unfocusedBorderColor = Color.White.copy(alpha = 0.3f)
                            )
                        )

                        Button(
                            onClick = {
                                viewModel.startCall(
                                    type = CallType.JOIN_CALL,
                                    targetName = "Mahanadi House Assembly",
                                    isVideo = true,
                                    roomCode = roomCodeInput
                                )
                                onNavigateToActiveCall()
                            },
                            shape = RoundedCornerShape(12.dp),
                            colors = ButtonDefaults.buttonColors(containerColor = SunGold)
                        ) {
                            Text("Join", fontWeight = FontWeight.Bold, color = NavyDark)
                        }
                    }
                }
            }
        }

        // 2. Direct Teacher & Captain Hotline
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(18.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(
                        text = "TEACHER & CAPTAIN DIRECT LINE",
                        color = NavyPrimary,
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )

                    Spacer(modifier = Modifier.height(8.dp))

                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(10.dp)
                    ) {
                        // Call Teacher Button
                        FilledTonalButton(
                            onClick = {
                                viewModel.startCall(
                                    type = CallType.TEACHER_CAPTAIN_CALL,
                                    targetName = "Mrs. Ananya Sharma (House Teacher)",
                                    isVideo = true
                                )
                                onNavigateToActiveCall()
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.School, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("House Teacher", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }

                        // Call Captain Button
                        FilledTonalButton(
                            onClick = {
                                viewModel.startCall(
                                    type = CallType.TEACHER_CAPTAIN_CALL,
                                    targetName = "Rohan Verma (Captain)",
                                    isVideo = true
                                )
                                onNavigateToActiveCall()
                            },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp)
                        ) {
                            Icon(Icons.Default.Shield, contentDescription = null, modifier = Modifier.size(16.dp))
                            Spacer(modifier = Modifier.width(6.dp))
                            Text("House Captain", fontSize = 11.sp, fontWeight = FontWeight.Bold)
                        }
                    }
                }
            }
        }

        // 3. Member to Member Peer Calling
        item {
            Text(
                text = "HOUSE PEER DIRECT CALLS",
                color = TextSecondaryLight,
                fontSize = 11.sp,
                fontWeight = FontWeight.Black,
                letterSpacing = 1.sp
            )
        }

        items(otherMembers) { member ->
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(12.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Column(modifier = Modifier.weight(1f)) {
                        Text(
                            text = member.fullName,
                            fontWeight = FontWeight.Bold,
                            fontSize = 14.sp,
                            color = TextPrimaryLight
                        )
                        Text(
                            text = "${member.role.title} • Class ${member.classLevel}",
                            fontSize = 11.sp,
                            color = TextSecondaryLight
                        )
                    }

                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        // Voice Call
                        IconButton(
                            onClick = {
                                viewModel.startCall(
                                    type = CallType.MEMBER_CALL,
                                    targetName = member.fullName,
                                    isVideo = false
                                )
                                onNavigateToActiveCall()
                            },
                            modifier = Modifier
                                .size(36.dp)
                                .background(AzureBlue.copy(alpha = 0.12f), RoundedCornerShape(18.dp))
                        ) {
                            Icon(Icons.Default.Call, contentDescription = "Voice Call", tint = AzureBlue, modifier = Modifier.size(18.dp))
                        }

                        // Video Call
                        IconButton(
                            onClick = {
                                viewModel.startCall(
                                    type = CallType.MEMBER_CALL,
                                    targetName = member.fullName,
                                    isVideo = true
                                )
                                onNavigateToActiveCall()
                            },
                            modifier = Modifier
                                .size(36.dp)
                                .background(Color(0xFF10B981).copy(alpha = 0.15f), RoundedCornerShape(18.dp))
                        ) {
                            Icon(Icons.Default.Videocam, contentDescription = "Video Call", tint = Color(0xFF10B981), modifier = Modifier.size(18.dp))
                        }
                    }
                }
            }
        }
    }
}
