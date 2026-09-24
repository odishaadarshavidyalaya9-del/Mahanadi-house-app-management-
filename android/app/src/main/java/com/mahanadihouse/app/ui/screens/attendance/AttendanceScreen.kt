package com.mahanadihouse.app.ui.screens.attendance

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
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@Composable
fun AttendanceScreen(viewModel: HouseViewModel) {
    val currentUser by viewModel.currentUser.collectAsState()
    val users by viewModel.users.collectAsState()
    val attendanceByDate by viewModel.attendanceByDate.collectAsState()

    var selectedDate by remember { mutableStateOf(viewModel.getTodayDate()) }
    val isAuthorized = currentUser?.role?.canTakeAttendance == true

    // Filter students for attendance roll call
    val studentMembers = users.filter { it.classLevel != "Faculty" }

    val dayData = attendanceByDate[selectedDate]
    val records = dayData?.records ?: emptyMap()

    val presentCount = studentMembers.count { records[it.id]?.isPresent != false }
    val totalCount = studentMembers.size
    val percentage = if (totalCount > 0) (presentCount * 100) / totalCount else 100

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(BackgroundLight)
            .padding(horizontal = 16.dp),
        contentPadding = PaddingValues(top = 16.dp, bottom = 80.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp)
    ) {
        // Date Selector & Overview Card
        item {
            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = NavyPrimary)
            ) {
                Column(modifier = Modifier.padding(18.dp)) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "HOUSE ROLL CALL REGISTER",
                            color = SunGold,
                            fontSize = 11.sp,
                            fontWeight = FontWeight.Black,
                            letterSpacing = 1.sp
                        )

                        Surface(
                            shape = RoundedCornerShape(12.dp),
                            color = if (isAuthorized) Color(0xFF10B981) else Color.White.copy(alpha = 0.2f)
                        ) {
                            Text(
                                text = if (isAuthorized) "Marking Enabled" else "View Mode Only",
                                color = Color.White,
                                fontSize = 10.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 8.dp, vertical = 4.dp)
                            )
                        }
                    }

                    Spacer(modifier = Modifier.height(12.dp))

                    // Date Switching Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween,
                        verticalAlignment = Alignment.CenterVertically
                    ) {
                        Text(
                            text = "Date: $selectedDate",
                            color = Color.White,
                            fontSize = 17.sp,
                            fontWeight = FontWeight.Bold
                        )

                        Row(horizontalArrangement = Arrangement.spacedBy(6.dp)) {
                            FilledTonalButton(
                                onClick = { selectedDate = "2026-09-20" },
                                colors = ButtonDefaults.filledTonalButtonColors(
                                    containerColor = if (selectedDate == "2026-09-20") SunGold else Color.White.copy(alpha = 0.15f)
                                ),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    "Yesterday",
                                    fontSize = 11.sp,
                                    color = if (selectedDate == "2026-09-20") NavyPrimary else Color.White
                                )
                            }

                            FilledTonalButton(
                                onClick = { selectedDate = viewModel.getTodayDate() },
                                colors = ButtonDefaults.filledTonalButtonColors(
                                    containerColor = if (selectedDate == viewModel.getTodayDate()) SunGold else Color.White.copy(alpha = 0.15f)
                                ),
                                contentPadding = PaddingValues(horizontal = 8.dp, vertical = 4.dp)
                            ) {
                                Text(
                                    "Today",
                                    fontSize = 11.sp,
                                    color = if (selectedDate == viewModel.getTodayDate()) NavyPrimary else Color.White
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(14.dp))

                    // Progress stats
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.SpaceBetween
                    ) {
                        Text(
                            text = "$presentCount of $totalCount Members Present",
                            color = Color.White.copy(alpha = 0.85f),
                            fontSize = 12.sp
                        )
                        Text(
                            text = "$percentage% Attendance",
                            color = SunGold,
                            fontWeight = FontWeight.Bold,
                            fontSize = 12.sp
                        )
                    }

                    Spacer(modifier = Modifier.height(6.dp))
                    LinearProgressIndicator(
                        progress = { percentage / 100f },
                        modifier = Modifier.fillMaxWidth().height(6.dp),
                        color = SunGold,
                        trackColor = Color.White.copy(alpha = 0.2f),
                    )
                }
            }
        }

        // List Header
        item {
            Row(
                modifier = Modifier.fillMaxWidth(),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically
            ) {
                Text(
                    text = "STUDENT ROLL CALL LIST (${studentMembers.size})",
                    color = TextSecondaryLight,
                    fontSize = 11.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 0.5.sp
                )
                if (isAuthorized) {
                    Text(
                        text = "Tap to toggle Present / Absent",
                        color = AzureBlue,
                        fontSize = 11.sp
                    )
                }
            }
        }

        // Student Members Attendance Rows
        items(studentMembers) { student ->
            val record = records[student.id]
            val isPresent = record?.isPresent ?: true

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(14.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 1.dp)
            ) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(14.dp),
                    horizontalArrangement = Arrangement.SpaceBetween,
                    verticalAlignment = Alignment.CenterVertically
                ) {
                    Row(
                        verticalAlignment = Alignment.CenterVertically,
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = NavyPrimary.copy(alpha = 0.08f),
                            modifier = Modifier.size(38.dp)
                        ) {
                            Box(contentAlignment = Alignment.Center) {
                                Text(
                                    text = student.rollNumber,
                                    fontWeight = FontWeight.Bold,
                                    fontSize = 13.sp,
                                    color = NavyPrimary
                                )
                            }
                        }

                        Column {
                            Text(
                                text = student.fullName,
                                fontWeight = FontWeight.Bold,
                                fontSize = 14.sp,
                                color = TextPrimaryLight
                            )
                            Text(
                                text = "Class ${student.classLevel} - Sec ${student.section} • Roll #${student.rollNumber}",
                                fontSize = 11.sp,
                                color = TextSecondaryLight
                            )
                        }
                    }

                    if (isAuthorized) {
                        Button(
                            onClick = {
                                viewModel.markAttendance(
                                    date = selectedDate,
                                    memberId = student.id,
                                    isPresent = !isPresent,
                                    remarks = if (!isPresent) "Present" else "Absent on roll call"
                                )
                            },
                            shape = RoundedCornerShape(10.dp),
                            colors = ButtonDefaults.buttonColors(
                                containerColor = if (isPresent) Color(0xFF10B981) else Color(0xFFEF4444)
                            ),
                            contentPadding = PaddingValues(horizontal = 14.dp, vertical = 6.dp)
                        ) {
                            Text(
                                text = if (isPresent) "PRESENT" else "ABSENT",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = Color.White
                            )
                        }
                    } else {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = if (isPresent) Color(0xFFD1FAE5) else Color(0xFFFEE2E2)
                        ) {
                            Text(
                                text = if (isPresent) "PRESENT" else "ABSENT",
                                color = if (isPresent) Color(0xFF065F46) else Color(0xFF991B1B),
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                            )
                        }
                    }
                }
            }
        }
    }
}
