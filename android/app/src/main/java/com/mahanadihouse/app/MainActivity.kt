package com.mahanadihouse.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.viewModels
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.material3.Surface
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.mahanadihouse.app.ui.navigation.AppNavGraph
import com.mahanadihouse.app.ui.theme.BackgroundLight
import com.mahanadihouse.app.ui.theme.MahanadiHouseTheme
import com.mahanadihouse.app.viewmodel.HouseViewModel

class MainActivity : ComponentActivity() {
    private val houseViewModel: HouseViewModel by viewModels()

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            MahanadiHouseTheme {
                Surface(
                    modifier = Modifier.fillMaxSize(),
                    color = BackgroundLight
                ) {
                    val navController = rememberNavController()
                    AppNavGraph(
                        navController = navController,
                        viewModel = houseViewModel
                    )
                }
            }
        }
    }
}
