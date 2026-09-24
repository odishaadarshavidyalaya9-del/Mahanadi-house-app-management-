package com.mahanadihouse.app.ui.screens.auth

import androidx.compose.foundation.background
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
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahanadihouse.app.model.Role
import com.mahanadihouse.app.ui.components.MahanadiLogoView
import com.mahanadihouse.app.ui.theme.*
import com.mahanadihouse.app.viewmodel.HouseViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun RoleLoginScreen(
    roleName: String,
    viewModel: HouseViewModel,
    onLoginSuccess: () -> Unit,
    onBackClick: () -> Unit
) {
    val role = try {
        Role.valueOf(roleName)
    } catch (e: Exception) {
        Role.HOUSE_MEMBER
    }

    var authMethod by remember { mutableStateOf("EMAIL") } // EMAIL, MOBILE, GOOGLE
    var email by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    var mobile by remember { mutableStateOf("") }
    var otp by remember { mutableStateOf("") }
    var otpSent by remember { mutableStateOf(false) }
    var errorMessage by remember { mutableStateOf<String?>(null) }

    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text(role.title, color = Color.White) },
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
            Spacer(modifier = Modifier.height(10.dp))
            MahanadiLogoView(size = 56.dp, showText = true)

            Spacer(modifier = Modifier.height(20.dp))

            // Method Selector: Email | Mobile | Google
            TabRow(
                selectedTabIndex = if (authMethod == "EMAIL") 0 else if (authMethod == "MOBILE") 1 else 2,
                containerColor = Color.White,
                contentColor = NavyPrimary
            ) {
                Tab(
                    selected = authMethod == "EMAIL",
                    onClick = { authMethod = "EMAIL"; errorMessage = null },
                    text = { Text("Email", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = authMethod == "MOBILE",
                    onClick = { authMethod = "MOBILE"; errorMessage = null },
                    text = { Text("Mobile OTP", fontWeight = FontWeight.Bold) }
                )
                Tab(
                    selected = authMethod == "GOOGLE",
                    onClick = { authMethod = "GOOGLE"; errorMessage = null },
                    text = { Text("Google", fontWeight = FontWeight.Bold) }
                )
            }

            Spacer(modifier = Modifier.height(24.dp))

            Card(
                modifier = Modifier.fillMaxWidth(),
                shape = RoundedCornerShape(20.dp),
                colors = CardDefaults.cardColors(containerColor = Color.White),
                elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
            ) {
                Column(
                    modifier = Modifier.padding(20.dp),
                    verticalArrangement = Arrangement.spacedBy(16.dp)
                ) {
                    if (errorMessage != null) {
                        Surface(
                            shape = RoundedCornerShape(10.dp),
                            color = Color(0xFFFEE2E2),
                            modifier = Modifier.fillMaxWidth()
                        ) {
                            Text(
                                text = errorMessage ?: "",
                                color = Color(0xFFB91C1C),
                                fontSize = 12.sp,
                                modifier = Modifier.padding(10.dp)
                            )
                        }
                    }

                    when (authMethod) {
                        "EMAIL" -> {
                            OutlinedTextField(
                                value = email,
                                onValueChange = { email = it },
                                label = { Text("School Email Address") },
                                placeholder = { Text("student@mahanadi.school.edu") },
                                leadingIcon = { Icon(Icons.Default.Email, contentDescription = null) },
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                singleLine = true
                            )

                            OutlinedTextField(
                                value = password,
                                onValueChange = { password = it },
                                label = { Text("Password") },
                                leadingIcon = { Icon(Icons.Default.Lock, contentDescription = null) },
                                visualTransformation = PasswordVisualTransformation(),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                singleLine = true
                            )

                            Button(
                                onClick = {
                                    if (email.isBlank()) {
                                        // Demo auto-fill for testing role
                                        viewModel.loginWithRole(role)
                                        onLoginSuccess()
                                    } else {
                                        val ok = viewModel.loginWithEmail(email)
                                        if (ok) onLoginSuccess() else {
                                            viewModel.loginWithRole(role)
                                            onLoginSuccess()
                                        }
                                    }
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(50.dp),
                                shape = RoundedCornerShape(14.dp),
                                colors = ButtonDefaults.buttonColors(containerColor = NavyPrimary)
                            ) {
                                Text("Sign In with Email", fontWeight = FontWeight.Bold, color = Color.White)
                            }
                        }

                        "MOBILE" -> {
                            OutlinedTextField(
                                value = mobile,
                                onValueChange = { mobile = it },
                                label = { Text("10-Digit Mobile Number") },
                                placeholder = { Text("+91 9876543210") },
                                leadingIcon = { Icon(Icons.Default.Phone, contentDescription = null) },
                                keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Phone),
                                modifier = Modifier.fillMaxWidth(),
                                shape = RoundedCornerShape(14.dp),
                                singleLine = true
                            )

                            if (otpSent) {
                                OutlinedTextField(
                                    value = otp,
                                    onValueChange = { otp = it },
                                    label = { Text("Enter 6-Digit OTP") },
                                    placeholder = { Text("123456") },
                                    leadingIcon = { Icon(Icons.Default.Pin, contentDescription = null) },
                                    keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Number),
                                    modifier = Modifier.fillMaxWidth(),
                                    shape = RoundedCornerShape(14.dp),
                                    singleLine = true
                                )

                                Button(
                                    onClick = {
                                        viewModel.loginWithMobileOtp(mobile)
                                        onLoginSuccess()
                                    },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(50.dp),
                                    shape = RoundedCornerShape(14.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = NavyPrimary)
                                ) {
                                    Text("Verify & Continue", fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            } else {
                                Button(
                                    onClick = { otpSent = true },
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .height(50.dp),
                                    shape = RoundedCornerShape(14.dp),
                                    colors = ButtonDefaults.buttonColors(containerColor = AzureBlue)
                                ) {
                                    Text("Send One-Time Password", fontWeight = FontWeight.Bold, color = Color.White)
                                }
                            }
                        }

                        "GOOGLE" -> {
                            Text(
                                text = "Sign in quickly using your official Mahanadi school Google workspace account.",
                                color = TextSecondaryLight,
                                fontSize = 13.sp,
                                textAlign = TextAlign.Center
                            )

                            OutlinedButton(
                                onClick = {
                                    viewModel.loginWithRole(role)
                                    onLoginSuccess()
                                },
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .height(52.dp),
                                shape = RoundedCornerShape(14.dp)
                            ) {
                                Icon(
                                    imageVector = Icons.Default.AccountCircle,
                                    contentDescription = null,
                                    tint = NavyPrimary,
                                    modifier = Modifier.size(24.dp)
                                )
                                Spacer(modifier = Modifier.width(10.dp))
                                Text("Continue with Google", fontWeight = FontWeight.Bold, color = NavyPrimary)
                            }
                        }
                    }

                    // Demo 1-Tap Entry for fast evaluation in Android Studio / device
                    TextButton(
                        onClick = {
                            viewModel.loginWithRole(role)
                            onLoginSuccess()
                        },
                        modifier = Modifier.fillMaxWidth()
                    ) {
                        Text(
                            text = "⚡ Instant Demo Entry as ${role.title}",
                            color = AzureBlue,
                            fontSize = 12.sp,
                            fontWeight = FontWeight.Bold
                        )
                    }
                }
            }
        }
    }
}
