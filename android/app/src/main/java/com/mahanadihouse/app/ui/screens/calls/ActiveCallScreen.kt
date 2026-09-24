package com.mahanadihouse.app.ui.screens.calls

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahanadihouse.app.ui.components.MahanadiLogoView
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun ActiveCallScreen(
    viewModel: HouseViewModel,
    onCallEnded: () -> Unit
) {
    val callSession by viewModel.activeCall.collectAsState()

    if (callSession == null) {
        LaunchedEffect(Unit) {
            onCallEnded()
        }
        return
    }

    val call = callSession!!

    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(
                Brush.verticalGradient(
                    listOf(NavyDark, Color(0xFF0F1E36), Color(0xFF050B14))
                )
            )
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(24.dp),
            horizontalAlignment = Alignment.CenterHorizontally,
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            // Header Info
            Column(
                horizontalAlignment = Alignment.CenterHorizontally,
                modifier = Modifier.padding(top = 24.dp)
            ) {
                MahanadiLogoView(size = 40.dp, showText = false)
                Spacer(modifier = Modifier.height(12.dp))
                Text(
                    text = call.title,
                    color = SunGold,
                    fontSize = 14.sp,
                    fontWeight = FontWeight.Bold
                )
                Text(
                    text = call.targetName,
                    color = Color.White,
                    fontSize = 22.sp,
                    fontWeight = FontWeight.Black,
                    modifier = Modifier.padding(top = 4.dp)
                )
                Surface(
                    shape = RoundedCornerShape(12.dp),
                    color = Color(0xFF10B981).copy(alpha = 0.2f),
                    modifier = Modifier.padding(top = 8.dp)
                ) {
                    Text(
                        text = "Encrypted House Link • Connected",
                        color = Color(0xFF34D399),
                        fontSize = 11.sp,
                        fontWeight = FontWeight.Bold,
                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 4.dp)
                    )
                }
            }

            // Central Video Simulation / Audio Visualizer
            Box(
                modifier = Modifier
                    .size(180.dp)
                    .background(Color.White.copy(alpha = 0.08f), CircleShape),
                contentAlignment = Alignment.Center
            ) {
                if (call.isVideo && !call.isVideoOff) {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.Videocam,
                            contentDescription = null,
                            tint = AzureLight,
                            modifier = Modifier.size(56.dp)
                        )
                        Text(
                            text = "HD Video Active",
                            color = Color.White.copy(alpha = 0.8f),
                            fontSize = 12.sp,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                } else {
                    Column(horizontalAlignment = Alignment.CenterHorizontally) {
                        Icon(
                            imageVector = Icons.Default.AccountCircle,
                            contentDescription = null,
                            tint = SunGold,
                            modifier = Modifier.size(64.dp)
                        )
                        Text(
                            text = "Audio Call",
                            color = Color.White.copy(alpha = 0.8f),
                            fontSize = 12.sp,
                            modifier = Modifier.padding(top = 8.dp)
                        )
                    }
                }
            }

            // Controls Bar
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .padding(bottom = 32.dp),
                horizontalArrangement = Arrangement.SpaceEvenly,
                verticalAlignment = Alignment.CenterVertically
            ) {
                // Mute Mic Toggle
                IconButton(
                    onClick = { viewModel.toggleMute() },
                    modifier = Modifier
                        .size(56.dp)
                        .background(if (call.isMuted) Color.Red else Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(
                        imageVector = if (call.isMuted) Icons.Default.MicOff else Icons.Default.Mic,
                        contentDescription = "Mute",
                        tint = Color.White
                    )
                }

                // Video On/Off Toggle
                IconButton(
                    onClick = { viewModel.toggleVideo() },
                    modifier = Modifier
                        .size(56.dp)
                        .background(if (call.isVideoOff) Color.DarkGray else Color.White.copy(alpha = 0.2f), CircleShape)
                ) {
                    Icon(
                        imageVector = if (call.isVideoOff) Icons.Default.VideocamOff else Icons.Default.Videocam,
                        contentDescription = "Camera Toggle",
                        tint = Color.White
                    )
                }

                // End Call Button
                IconButton(
                    onClick = {
                        viewModel.endCall()
                        onCallEnded()
                    },
                    modifier = Modifier
                        .size(64.dp)
                        .background(Color(0xFFEF4444), CircleShape)
                ) {
                    Icon(
                        imageVector = Icons.Default.CallEnd,
                        contentDescription = "End Call",
                        tint = Color.White,
                        modifier = Modifier.size(28.dp)
                    )
                }
            }
        }
    }
}
