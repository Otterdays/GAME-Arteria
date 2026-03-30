package com.arteria.game.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.arteria.game.ui.theme.ArteriaPalette

@Composable
fun DockingTitleBlock(
    title: String,
    subtitle: String,
    pretag: String = "✦ ARTERIA ✦",
    modifier: Modifier = Modifier,
) {
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 8.dp, vertical = 8.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = pretag,
            style = MaterialTheme.typography.labelSmall,
            color = ArteriaPalette.Gold,
        )
        Text(
            text = title,
            style = MaterialTheme.typography.displaySmall,
            color = ArteriaPalette.TextPrimary,
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 4.dp),
        )
        Text(
            text = subtitle,
            style = MaterialTheme.typography.bodySmall,
            color = Color(0xFFC8CDDC).copy(alpha = 0.55f),
            textAlign = TextAlign.Center,
            modifier = Modifier.padding(top = 8.dp),
        )
    }
}

@Composable
fun DockingNewAccountSlot(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val shape = RoundedCornerShape(12.dp)
    Column(
        modifier = modifier
            .fillMaxWidth()
            .clip(shape)
            .border(1.5.dp, ArteriaPalette.LuminarEnd.copy(alpha = 0.35f), shape)
            .background(ArteriaPalette.LuminarEnd.copy(alpha = 0.06f))
            .clickable(onClick = onClick)
            .padding(vertical = 20.dp, horizontal = 16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text(
            text = "+",
            color = ArteriaPalette.LuminarEnd,
            fontSize = 30.sp,
            lineHeight = 34.sp,
        )
        Text(
            text = "New account",
            style = MaterialTheme.typography.bodySmall,
            color = ArteriaPalette.LuminarEnd.copy(alpha = 0.75f),
            modifier = Modifier.padding(top = 4.dp),
        )
    }
}

@Composable
fun DockingLoreFooter(
    modifier: Modifier = Modifier,
) {
    Text(
        text = "\"Every Anchor is a weight against the Unraveling. The cosmos keeps count.\"\n— Blibbertooth, probably",
        style = MaterialTheme.typography.bodySmall,
        color = Color(0xFFC8CDDC).copy(alpha = 0.28f),
        textAlign = TextAlign.Center,
        modifier = modifier
            .fillMaxWidth()
            .padding(horizontal = 12.dp, vertical = 24.dp),
    )
}
