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
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CenterAlignedTopAppBar
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.FilterChip
import androidx.compose.material3.FilterChipDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.OutlinedTextFieldDefaults
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TopAppBarDefaults
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.unit.dp
import com.arteria.game.ui.components.DockingBackground
import com.arteria.game.ui.theme.ArteriaPalette

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun AccountCreationScreen(
    onBack: () -> Unit,
    onCreateAccount: (displayName: String) -> Unit,
    modifier: Modifier = Modifier,
) {
    var displayName by rememberSaveable { mutableStateOf("") }
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
                        "New account",
                        style = MaterialTheme.typography.titleLarge,
                        color = ArteriaPalette.TextPrimary,
                    )
                },
                navigationIcon = {
                    TextButton(onClick = onBack) {
                        Text("Back", color = ArteriaPalette.AccentPrimary)
                    }
                },
                colors = TopAppBarDefaults.centerAlignedTopAppBarColors(
                    containerColor = Color.Transparent,
                    titleContentColor = ArteriaPalette.TextPrimary,
                ),
            )
            Column(
                modifier = Modifier
                    .padding(horizontal = 16.dp)
                    .verticalScroll(rememberScrollState())
                    .padding(bottom = 24.dp),
                verticalArrangement = Arrangement.spacedBy(16.dp),
            ) {
                Text(
                    text = "Name your profile. Standard is the only game mode for now.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = ArteriaPalette.TextSecondary,
                )
                Surface(
                    shape = cardShape,
                    color = ArteriaPalette.BgCard.copy(alpha = 0.94f),
                    modifier = Modifier
                        .fillMaxWidth()
                        .border(1.dp, ArteriaPalette.Border, cardShape),
                ) {
                    Column(
                        modifier = Modifier.padding(16.dp),
                        verticalArrangement = Arrangement.spacedBy(14.dp),
                    ) {
                        OutlinedTextField(
                            value = displayName,
                            onValueChange = { displayName = it },
                            label = { Text("Account name") },
                            singleLine = true,
                            modifier = Modifier.fillMaxWidth(),
                            colors = OutlinedTextFieldDefaults.colors(
                                focusedTextColor = ArteriaPalette.TextPrimary,
                                unfocusedTextColor = ArteriaPalette.TextPrimary,
                                focusedBorderColor = ArteriaPalette.AccentPrimary,
                                unfocusedBorderColor = ArteriaPalette.Border,
                                focusedLabelColor = ArteriaPalette.AccentHover,
                                unfocusedLabelColor = ArteriaPalette.TextMuted,
                                cursorColor = ArteriaPalette.AccentPrimary,
                                focusedContainerColor = ArteriaPalette.BgInput.copy(alpha = 0.6f),
                                unfocusedContainerColor = ArteriaPalette.BgInput.copy(alpha = 0.6f),
                            ),
                        )
                        Text(
                            text = "Game mode",
                            style = MaterialTheme.typography.titleSmall,
                            color = ArteriaPalette.TextPrimary,
                        )
                        FilterChip(
                            selected = true,
                            onClick = { },
                            label = { Text("Standard") },
                            colors = FilterChipDefaults.filterChipColors(
                                containerColor = ArteriaPalette.AccentPrimary.copy(alpha = 0.22f),
                                labelColor = ArteriaPalette.AccentHover,
                                selectedContainerColor = ArteriaPalette.AccentPrimary.copy(alpha = 0.35f),
                                selectedLabelColor = Color.White,
                            ),
                            border = FilterChipDefaults.filterChipBorder(
                                enabled = true,
                                selected = true,
                                borderColor = ArteriaPalette.AccentPrimary.copy(alpha = 0.55f),
                            ),
                        )
                        Text(
                            text = "Hardcore, seasonal, and other modes will plug in here later.",
                            style = MaterialTheme.typography.bodySmall,
                            color = ArteriaPalette.TextMuted,
                        )
                    }
                }
                Button(
                    onClick = {
                        val name = displayName.trim().ifBlank { "Adventurer" }
                        onCreateAccount(name)
                    },
                    modifier = Modifier.fillMaxWidth(),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = ArteriaPalette.AccentPrimary,
                        contentColor = Color.White,
                    ),
                ) {
                    Text("Create account")
                }
            }
        }
    }
}
