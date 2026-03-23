package com.arteria.game.ui.account

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.arteria.game.ui.components.DockingBackground
import com.arteria.game.ui.theme.ArteriaPalette

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun PlayPlaceholderScreen(
    accountDisplayName: String,
    onBackToAccounts: () -> Unit,
    modifier: Modifier = Modifier,
) {
    val cardShape = RoundedCornerShape(12.dp)

    Box(modifier = modifier.fillMaxSize()) {
        DockingBackground(Modifier.fillMaxSize())
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding(),
        ) {
            CenterAlignedTopAppBar(
                title = {
                    Text(
                        "Session",
                        style = MaterialTheme.typography.titleLarge,
                        color = ArteriaPalette.TextPrimary,
                    )
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent,
                ),
            )
            Column(
                modifier = Modifier
                    .padding(16.dp)
                    .fillMaxSize(),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Surface(
                    shape = cardShape,
                    color = ArteriaPalette.BgCard.copy(alpha = 0.94f),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ArteriaPalette.Border, cardShape),
                ) {
                    Column(
                        modifier = Modifier.padding(20.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Text(
                            text = "Signed in as",
                            style = MaterialTheme.typography.labelLarge,
                            color = ArteriaPalette.TextSecondary,
                        )
                        Text(
                            text = accountDisplayName,
                            style = MaterialTheme.typography.headlineMedium,
                            color = ArteriaPalette.TextPrimary,
                        )
                        Text(
                            text = "Game mode · Standard",
                            style = MaterialTheme.typography.bodyLarge,
                            color = ArteriaPalette.AccentHover,
                        )
                        Text(
                            text = "Gameplay is not wired up yet. This screen only proves navigation from the Docking Station.",
                            style = MaterialTheme.typography.bodyMedium,
                            color = ArteriaPalette.TextMuted,
                        )
                    }
                }
                Button(
                    onClick = onBackToAccounts,
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ArteriaPalette.AccentPrimary,
                        contentColor = Color.White,
                    ),
                ) {
                    Text("Back to Docking Station")
                }
            }
        }
    }
}
