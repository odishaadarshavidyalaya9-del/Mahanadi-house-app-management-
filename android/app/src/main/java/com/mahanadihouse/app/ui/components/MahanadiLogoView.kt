package com.mahanadihouse.app.ui.components

import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.*
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.drawscope.Fill
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.mahanadihouse.app.ui.theme.AzureBlue
import com.mahanadihouse.app.ui.theme.AzureLight
import com.mahanadihouse.app.ui.theme.SunGold
import com.mahanadihouse.app.ui.theme.SunGoldAmber

@Composable
fun MahanadiLogoView(
    modifier: Modifier = Modifier,
    size: Dp = 48.dp,
    showText: Boolean = false,
    textColor: Color = MaterialTheme.colorScheme.onBackground
) {
    Row(
        modifier = modifier,
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(10.dp)
    ) {
        Canvas(modifier = Modifier.size(size)) {
            val w = this.size.width
            val h = this.size.height
            val scale = w / 200f

            // 1. Rising Sun Disk and 9 Crown Rays in Golden Yellow
            val sunPath = Path().apply {
                moveTo(36f * scale, 96f * scale)
                lineTo(40f * scale, 70f * scale)
                lineTo(53f * scale, 49f * scale)
                lineTo(75f * scale, 34f * scale)
                lineTo(100f * scale, 26f * scale) // Central ray
                lineTo(125f * scale, 34f * scale)
                lineTo(147f * scale, 49f * scale)
                lineTo(160f * scale, 70f * scale)
                lineTo(164f * scale, 96f * scale)
                close()
            }
            drawPath(sunPath, color = SunGold, style = Fill)

            // Semicircular sun disk
            drawArc(
                color = SunGoldAmber,
                startAngle = 180f,
                sweepAngle = 180f,
                useCenter = true,
                topLeft = Offset(44f * scale, 44f * scale),
                size = Size(112f * scale, 112f * scale)
            )

            // Dynamic Spiral Ribbon in Sun Core
            val spiralPath = Path().apply {
                moveTo(103f * scale, 96f * scale)
                cubicTo(84f * scale, 94f * scale, 68f * scale, 83f * scale, 67f * scale, 70f * scale)
                cubicTo(66f * scale, 54f * scale, 81f * scale, 42f * scale, 99f * scale, 41f * scale)
                cubicTo(118f * scale, 40f * scale, 133f * scale, 52f * scale, 133f * scale, 69f * scale)
                cubicTo(133f * scale, 83f * scale, 121f * scale, 91f * scale, 106f * scale, 91f * scale)
            }
            drawPath(
                spiralPath,
                color = Color.White.copy(alpha = 0.85f),
                style = Stroke(width = 6f * scale)
            )

            // 2. Open Book / Flowing River Waves in Azure Blue
            val bookPath = Path().apply {
                moveTo(100f * scale, 103f * scale)
                cubicTo(77f * scale, 95f * scale, 50f * scale, 96f * scale, 24f * scale, 101f * scale)
                lineTo(24f * scale, 117f * scale)
                cubicTo(48f * scale, 112f * scale, 75f * scale, 112f * scale, 100f * scale, 132f * scale)
                cubicTo(125f * scale, 112f * scale, 152f * scale, 112f * scale, 176f * scale, 117f * scale)
                lineTo(176f * scale, 101f * scale)
                cubicTo(150f * scale, 96f * scale, 123f * scale, 95f * scale, 100f * scale, 103f * scale)
                close()
            }
            drawPath(bookPath, color = AzureBlue, style = Fill)

            // Top Page Trim Highlight
            val trimLeft = Path().apply {
                moveTo(97f * scale, 97f * scale)
                cubicTo(75f * scale, 90f * scale, 50f * scale, 91f * scale, 26f * scale, 95f * scale)
                lineTo(26f * scale, 98f * scale)
                cubicTo(50f * scale, 94f * scale, 74f * scale, 93f * scale, 96f * scale, 100f * scale)
                close()
            }
            drawPath(trimLeft, color = AzureLight, style = Fill)

            val trimRight = Path().apply {
                moveTo(103f * scale, 97f * scale)
                cubicTo(125f * scale, 90f * scale, 150f * scale, 91f * scale, 174f * scale, 95f * scale)
                lineTo(174f * scale, 98f * scale)
                cubicTo(150f * scale, 94f * scale, 126f * scale, 93f * scale, 104f * scale, 100f * scale)
                close()
            }
            drawPath(trimRight, color = AzureLight, style = Fill)

            // Spine line
            drawLine(
                color = Color(0xFF004A94),
                start = Offset(100f * scale, 104f * scale),
                end = Offset(100f * scale, 132f * scale),
                strokeWidth = 2f * scale
            )
        }

        if (showText) {
            Column {
                Text(
                    text = "MAHANADI",
                    color = textColor,
                    fontSize = 17.sp,
                    fontWeight = FontWeight.Black,
                    letterSpacing = 1.sp,
                    lineHeight = 18.sp
                )
                Text(
                    text = "PRIDE BY MY SIDE",
                    color = SunGoldAmber,
                    fontSize = 9.sp,
                    fontWeight = FontWeight.Bold,
                    letterSpacing = 1.5.sp
                )
            }
        }
    }
}
