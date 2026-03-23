package com.arteria.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.arteria.game.ui.theme.ArteriaPalette

data class DockingGradientSet(
    val top: Color,
    val bottom: Color,
    val accent: Color,
)

fun dockingGradientForIndex(index: Int): DockingGradientSet = when (index % 3) {
    0 -> DockingGradientSet(
        top = Color(0xFF0F2060),
        bottom = Color(0xFF1A3D9E),
        accent = ArteriaPalette.LuminarEnd,
    )
    1 -> DockingGradientSet(
        top = Color(0xFF1A0A2E),
        bottom = Color(0xFF3D1060),
        accent = ArteriaPalette.VoidAccent,
    )
    else -> DockingGradientSet(
        top = Color(0xFF0A2A1A),
        bottom = Color(0xFF1A5835),
        accent = ArteriaPalette.BalancedEnd,
    )
}

@Composable
fun DockingAccountCard(
    displayName: String,
    metaLine: String,
    selected: Boolean,
    gradient: DockingGradientSet,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val shape = RoundedCornerShape(12.dp)
    val elevation = if (selected) 10.dp else 4.dp

    Surface(
        modifier = modifier.fillMaxWidth(),
        shape = shape,
        shadowElevation = elevation,
        color = Color.Transparent,
        tonalElevation = 0.dp,
    ) {
        Column(
            modifier = Modifier
                .clip(shape)
                .border(
                    width = 1.dp,
                    brush = Brush.linearGradient(
                        colors = listOf(
                            gradient.accent.copy(alpha = 0.45f),
                            gradient.accent.copy(alpha = 0.15f),
                        ),
                    ),
                    shape = shape,
                )
                .clickable(onClick = onClick),
        ) {
        Box(
            Modifier
                .fillMaxWidth()
                .height(3.dp)
                .background(gradient.accent.copy(alpha = 0.88f)),
        )
        Box(
            modifier = Modifier
                .fillMaxWidth()
                .background(
                    brush = Brush.linearGradient(
                        colors = listOf(gradient.top, gradient.bottom),
                    ),
                )
                .padding(16.dp),
        ) {
            Row(
                verticalAlignment = Alignment.CenterVertically,
                modifier = Modifier.fillMaxWidth(),
            ) {
                Column(modifier = Modifier.weight(1f)) {
                    Text(
                        text = displayName,
                        style = MaterialTheme.typography.titleLarge,
                        color = ArteriaPalette.TextPrimary,
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    Text(
                        text = metaLine,
                        style = MaterialTheme.typography.bodySmall,
                        color = Color(0xFFC8CDDC).copy(alpha = 0.65f),
                    )
                }
                Box(
                    modifier = Modifier
                        .size(44.dp)
                        .clip(CircleShape)
                        .border(1.5.dp, gradient.accent.copy(alpha = 0.9f), CircleShape)
                        .background(Color.Black.copy(alpha = 0.3f)),
                    contentAlignment = Alignment.Center,
                ) {
                    Text(
                        text = "▶",
                        color = gradient.accent,
                        style = MaterialTheme.typography.titleMedium,
                    )
                }
            }
        }
        }
    }
}
