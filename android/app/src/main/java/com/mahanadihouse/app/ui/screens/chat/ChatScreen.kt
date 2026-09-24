package com.mahanadihouse.app.ui.screens.chat

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
import com.mahanadihouse.app.model.ChatChannel
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun ChatScreen(viewModel: HouseViewModel) {
    val currentUser by viewModel.currentUser.collectAsState()
    val allMessages by viewModel.chatMessages.collectAsState()
    var selectedChannel by remember { mutableStateOf(ChatChannel.HOUSE_GROUP) }
    var inputText by remember { mutableStateOf("") }

    val filteredMessages = allMessages.filter { it.channel == selectedChannel }
    val canPostInCurrentChannel = if (selectedChannel == ChatChannel.OFFICIAL_ANNOUNCEMENTS) {
        currentUser?.role?.canBroadcastChat == true
    } else {
        true
    }

    Column(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
    ) {
        // Channel Switching Header
        Surface(
            color = NavyPrimary,
            modifier = Modifier.fillMaxWidth()
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(horizontal = 12.dp, vertical = 8.dp),
                horizontalArrangement = Arrangement.spacedBy(8.dp)
            ) {
                FilterChip(
                    selected = selectedChannel == ChatChannel.HOUSE_GROUP,
                    onClick = { selectedChannel = ChatChannel.HOUSE_GROUP },
                    label = { Text("House Group", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = SunGold,
                        selectedLabelColor = NavyDark,
                        containerColor = Color.White.copy(alpha = 0.12f),
                        labelColor = Color.White
                    )
                )

                FilterChip(
                    selected = selectedChannel == ChatChannel.OFFICIAL_ANNOUNCEMENTS,
                    onClick = { selectedChannel = ChatChannel.OFFICIAL_ANNOUNCEMENTS },
                    label = { Text("Official Broadcast", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = SunGold,
                        selectedLabelColor = NavyDark,
                        containerColor = Color.White.copy(alpha = 0.12f),
                        labelColor = Color.White
                    )
                )

                FilterChip(
                    selected = selectedChannel == ChatChannel.DIRECT,
                    onClick = { selectedChannel = ChatChannel.DIRECT },
                    label = { Text("Peer Messages", fontSize = 12.sp) },
                    colors = FilterChipDefaults.filterChipColors(
                        selectedContainerColor = SunGold,
                        selectedLabelColor = NavyDark,
                        containerColor = Color.White.copy(alpha = 0.12f),
                        labelColor = Color.White
                    )
                )
            }
        }

        // Messages Feed
        LazyColumn(
            modifier = Modifier
                .weight(1f)
                .padding(horizontal = 14.dp),
            contentPadding = PaddingValues(top = 12.dp, bottom = 12.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp)
        ) {
            if (filteredMessages.isEmpty()) {
                item {
                    Box(
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(top = 40.dp),
                        contentAlignment = Alignment.Center
                    ) {
                        Text(
                            text = "No messages yet in this channel.",
                            color = TextSecondaryLight,
                            fontSize = 13.sp
                        )
                    }
                }
            }

            items(filteredMessages) { msg ->
                val isMe = msg.senderId == currentUser?.id

                Column(
                    modifier = Modifier.fillMaxWidth(),
                    horizontalAlignment = if (isMe) Alignment.End else Alignment.Start
                ) {
                    if (!isMe) {
                        Row(
                            verticalAlignment = Alignment.CenterVertically,
                            horizontalArrangement = Arrangement.spacedBy(6.dp),
                            modifier = Modifier.padding(bottom = 2.dp, start = 4.dp)
                        ) {
                            Text(
                                text = msg.senderName,
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = NavyPrimary
                            )
                            Surface(
                                shape = RoundedCornerShape(4.dp),
                                color = AzureBlue.copy(alpha = 0.12f)
                            ) {
                                Text(
                                    text = msg.senderRole.title,
                                    fontSize = 9.sp,
                                    fontWeight = FontWeight.SemiBold,
                                    color = AzureBlue,
                                    modifier = Modifier.padding(horizontal = 4.dp, vertical = 1.dp)
                                )
                            }
                        }
                    }

                    Surface(
                        shape = RoundedCornerShape(
                            topStart = 16.dp,
                            topEnd = 16.dp,
                            bottomStart = if (isMe) 16.dp else 4.dp,
                            bottomEnd = if (isMe) 4.dp else 16.dp
                        ),
                        color = if (isMe) AzureBlue else Color.White,
                        shadowElevation = 1.dp,
                        modifier = Modifier.widthIn(max = 280.dp)
                    ) {
                        Column(modifier = Modifier.padding(horizontal = 12.dp, vertical = 8.dp)) {
                            Text(
                                text = msg.text,
                                color = if (isMe) Color.White else TextPrimaryLight,
                                fontSize = 14.sp,
                                lineHeight = 18.sp
                            )
                            Spacer(modifier = Modifier.height(2.dp))
                            Text(
                                text = msg.timestamp,
                                color = if (isMe) Color.White.copy(alpha = 0.7f) else TextSecondaryLight,
                                fontSize = 10.sp,
                                modifier = Modifier.align(Alignment.End)
                            )
                        }
                    }
                }
            }
        }

        // Input bar or Permission Notice
        Surface(
            color = Color.White,
            shadowElevation = 4.dp,
            modifier = Modifier.fillMaxWidth()
        ) {
            if (canPostInCurrentChannel) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(horizontal = 12.dp, vertical = 8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(8.dp)
                ) {
                    OutlinedTextField(
                        value = inputText,
                        onValueChange = { inputText = it },
                        placeholder = { Text("Write message to house...", fontSize = 13.sp) },
                        modifier = Modifier.weight(1f),
                        shape = RoundedCornerShape(20.dp),
                        maxLines = 3
                    )

                    IconButton(
                        onClick = {
                            if (inputText.isNotBlank()) {
                                viewModel.sendChatMessage(selectedChannel, inputText)
                                inputText = ""
                            }
                        },
                        modifier = Modifier
                            .size(44.dp)
                            .background(NavyPrimary, RoundedCornerShape(22.dp))
                    ) {
                        Icon(
                            imageVector = Icons.Default.Send,
                            contentDescription = "Send",
                            tint = SunGold,
                            modifier = Modifier.size(18.dp)
                        )
                    }
                }
            } else {
                Surface(
                    color = Color(0xFFFEF3C7),
                    modifier = Modifier.fillMaxWidth()
                ) {
                    Row(
                        modifier = Modifier.padding(12.dp),
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(8.dp)
                    ) {
                        Icon(Icons.Default.Lock, contentDescription = null, tint = SunGoldAmber)
                        Text(
                            text = "Only House Captain & House Teacher can broadcast official announcements.",
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Medium,
                            color = Color(0xFF92400E)
                        )
                    }
                }
            }
        }
    }
}
