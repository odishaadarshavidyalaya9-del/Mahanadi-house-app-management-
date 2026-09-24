package com.mahanadihouse.app.ui.screens.auth

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahanadihouse.app.ui.components.MahanadiLogoView
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MemberEntryScreen(
    viewModel: HouseViewModel,
    onSuccess: () -> Unit,
    onBackClick: () -> Unit
) {
    var fullName by remember { mutableStateOf("") }
    var classLevel by remember { mutableStateOf("10th") }
    var section by remember { mutableStateOf("A") }
    var rollNumber by remember { mutableStateOf("") }
    var dob by remember { mutableStateOf("2010-06-15") }
    val houseName = "Mahanadi House"
    var mobile by remember { mutableStateOf("") }
    var email by remember { mutableStateOf("") }

    // Interactive Math Captcha
    val num1 by remember { mutableIntStateOf((3..9).random()) }
    val num2 by remember { mutableIntStateOf((2..8).random()) }
    val expectedCaptcha = num1 + num2
    var userCaptchaAnswer by remember { mutableStateOf("") }
    var captchaError by remember { mutableStateOf(false) }
    var validationError by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Member Entry Form", color = Color.White) },
                navigationIcon = {
                    IconButton(onClick = onBackClick) {
                        Icon(Icons.Default.ArrowBack, contentDescription = "Back", tint = Color.White)
                    }
                },
                colors = TopAppBarDefaults.topAppBarColors(containerColor = NavyPrimary)
            )
        }
    ) { padding ->
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(padding)
                .background(BackgroundLight)
                .verticalScroll(rememberScrollState())
                .padding(20.dp),
            horizontalAlignment = Alignment.CenterHorizontally
        ) {
            MahanadiLogoView(size = 48.dp, showText = true)

            Spacer(modifier = Modifier.height(16.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(14.dp)
                ) {
                    Text(
                        text = "NEW HOUSE MEMBER REGISTRATION",
                        color = NavyPrimary,
                        fontSize = 13.sp,
                        fontWeight = FontWeight.Black,
                        letterSpacing = 1.sp
                    )

                    if (validationError != null) {
                        Surface(
                            shape = RoundedCornerShape(8.dp),
                            color = Color(0xFFFEE2E2),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = validationError ?: "",
                                color = Color(0xFFB91C1C),
                                fontSize = 12.sp,
                                modifier = Modifier.padding(8.dp)
                            )
                        }
                    }

                    // 1. Full Name
                    OutlinedTextField(
                        value = fullName,
                        onValueChange = { fullName = it },
                        label = { Text("Student Full Name *") },
                        placeholder = { Text("e.g. Rahul Sharma") },
                        leadingIcon = { Icon(Icons.Default.Person, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    // 2. Class & Section Row
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(12.dp)
                    ) {
                        OutlinedTextField(
                            value = classLevel,
                            onValueChange = { classLevel = it },
                            label = { Text("Class *") },
                            placeholder = { Text("10th") },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )

                        OutlinedTextField(
                            value = section,
                            onValueChange = { section = it },
                            label = { Text("Section *") },
                            placeholder = { Text("A") },
                            modifier = Modifier.weight(1f),
                            shape = RoundedCornerShape(12.dp),
                            singleLine = true
                        )
                    }

                    // 3. Roll Number
                    OutlinedTextField(
                        value = rollNumber,
                        onValueChange = { rollNumber = it },
                        label = { Text("Roll Number *") },
                        placeholder = { Text("e.g. 24") },
                        leadingIcon = { Icon(Icons.Default.Badge, contentDescription = null) },
                        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    // 4. Date of Birth
                    OutlinedTextField(
                        value = dob,
                        onValueChange = { dob = it },
                        label = { Text("Date of Birth (YYYY-MM-DD) *") },
                        leadingIcon = { Icon(Icons.Default.CalendarToday, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    // 5. House (Auto-locked to Mahanadi House)
                    OutlinedTextField(
                        value = houseName,
                        onValueChange = {},
                        enabled = false,
                        label = { Text("House") },
                        leadingIcon = { Icon(Icons.Default.Shield, contentDescription = null, tint = SunGoldAmber) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        colors = OutlinedTextFieldDefaults.colors(
                            disabledTextColor = NavyPrimary,
                            disabledBorderColor = SunGoldAmber.copy(alpha = 0.5f),
                            disabledLeadingIconColor = SunGoldAmber,
                            disabledLabelColor = NavyPrimary
                        )
                    )

                    // Contact info (Email & Mobile)
                    OutlinedTextField(
                        value = email,
                        onValueChange = { email = it },
                        label = { Text("School Email (Optional)") },
                        placeholder = { Text("rahul@mahanadi.school.edu") },
                        leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    OutlinedTextField(
                        value = mobile,
                        onValueChange = { mobile = it },
                        label = { Text("Mobile Number (Optional)") },
                        placeholder = { Text("+91 9876543210") },
                        leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                        modifier = Modifier.fillMaxWidth(),
                        shape = RoundedCornerShape(12.dp),
                        singleLine = true
                    )

                    // 6. Captcha Verification Box
                    Surface(
                        shape = RoundedCornerShape(12.dp),
                        color = Color(0xFFF1F5F9),
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Column(modifier = Modifier.padding(12.dp)) {
                            Text(
                                text = "Security Verification (Captcha)",
                                fontSize = 11.sp,
                                fontWeight = FontWeight.Bold,
                                color = TextSecondaryLight
                            )
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(top = 8.dp),
                                verticalAlignment = Alignment.CenterVertically,
                                horizontalArrangement = Arrangement.spacedBy(10.dp)
                            ) {
                                Surface(
                                    shape = RoundedCornerShape(8.dp),
                                    color = NavyPrimary,
                                    modifier = Modifier.padding(end = 4.dp)
                                ) {
                                    Text(
                                        text = " $num1 + $num2 = ? ",
                                        color = SunGold,
                                        fontWeight = FontWeight.Black,
                                        fontSize = 16.sp,
                                        fontFamily = FontFamily.Monospace,
                                        modifier = Modifier.padding(horizontal = 10.dp, vertical = 6.dp)
                                    )
                                }

                                OutlinedTextField(
                                    value = userCaptchaAnswer,
                                    onValueChange = {
                                        userCaptchaAnswer = it
                                        captchaError = false
                                    },
                                    placeholder = { Text("Answer") },
                                    isError = captchaError,
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.weight(1f),
                                    shape = RoundedCornerShape(10.dp),
                                    singleLine = true
                                )
                            }
                            if (captchaError) {
                                Text(
                                    text = "Incorrect captcha. Please calculate $num1 + $num2",
                                    color = Color.Red,
                                    fontSize = 11.sp,
                                    modifier = Modifier.padding(top = 4.dp)
                                )
                            }
                        }
                    }

                    Spacer(modifier = Modifier.height(6.dp))

                    // Submit Button
                    Button(
                        onClick = {
                            if (fullName.isBlank() || rollNumber.isBlank()) {
                                validationError = "Please enter student Full Name and Roll Number"
                                return@Button
                            }
                            if (userCaptchaAnswer.trim() != expectedCaptcha.toString()) {
                                captchaError = true
                                return@Button
                            }

                            val cleanEmail = if (email.isNotBlank()) email.trim() else "${fullName.lowercase().replace(" ", "")}@mahanadi.school.edu"
                            val cleanMobile = if (mobile.isNotBlank()) mobile.trim() else "+91 9800000000"

                            viewModel.registerMember(
                                fullName = fullName,
                                classLevel = classLevel,
                                section = section,
                                rollNumber = rollNumber,
                                dob = dob,
                                email = cleanEmail,
                                mobileNumber = cleanMobile
                            )
                            onSuccess()
                        },
                        modifier = Modifier
                            .fillMaxWidth()
                            .height(52.dp),
                        shape = RoundedCornerShape(14.dp),
                        colors = ButtonDefaults.buttonColors(containerColor = NavyPrimary)
                    ) {
                        Icon(Icons.Default.CheckCircle, contentDescription = null, tint = SunGold)
                        Spacer(modifier = Modifier.width(8.dp))
                        Text(
                            text = "Register & Enter Mahanadi House",
                            fontWeight = FontWeight.Bold,
                            color = Color.White
                        )
                    }
                }
            }
        }
    }
}
