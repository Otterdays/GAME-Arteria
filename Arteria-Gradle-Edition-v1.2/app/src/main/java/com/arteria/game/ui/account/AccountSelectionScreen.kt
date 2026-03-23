package com.arteria.game.ui.account

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.navigationBarsPadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.statusBarsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.arteria.game.ui.components.DockingAccountCard
import com.arteria.game.ui.components.DockingBackground
import com.arteria.game.ui.components.DockingLoreFooter
import com.arteria.game.ui.components.DockingNewAccountSlot
import com.arteria.game.ui.components.DockingTitleBlock
import com.arteria.game.ui.components.dockingGradientForIndex
import com.arteria.game.ui.theme.ArteriaPalette

data class AccountSlot(
    val id: String,
    val displayName: String,
)

@Composable
fun AccountSelectionScreen(
    accounts: List<AccountSlot>,
    onCreateNewClick: () -> Unit,
    onContinueWithAccount: (AccountSlot) -> Unit,
    modifier: Modifier = Modifier,
) {
    var selectedId by remember(accounts) { mutableStateOf<String?>(accounts.firstOrNull()?.id) }

    Box(modifier = modifier.fillMaxSize()) {
        DockingBackground(Modifier.fillMaxSize())
        Column(
            modifier = Modifier
                .fillMaxSize()
                .statusBarsPadding()
                .navigationBarsPadding()
                .padding(horizontal = 16.dp),
        ) {
            DockingTitleBlock(
                title = "The Docking Station",
                subtitle = "Select an account to continue, or forge a new profile. " +
                    "(UI preview — nothing is saved to disk yet.)",
            )
            Spacer(Modifier.height(8.dp))

            if (accounts.isEmpty()) {
                Text(
                    text = "No accounts yet.\nTap below to create your first slot.",
                    style = MaterialTheme.typography.bodyMedium,
                    color = ArteriaPalette.TextSecondary,
                    textAlign = TextAlign.Center,
                    modifier = Modifier
                        .fillMaxWidth()
                        .padding(vertical = 24.dp),
                )
                DockingNewAccountSlot(onClick = onCreateNewClick)
                Spacer(Modifier.weight(1f))
            } else {
                LazyColumn(
                    verticalArrangement = Arrangement.spacedBy(10.dp),
                    contentPadding = PaddingValues(bottom = 12.dp),
                    modifier = Modifier.weight(1f),
                ) {
                    itemsIndexed(accounts, key = { _, a -> a.id }) { index, account ->
                        val selected = account.id == selectedId
                        DockingAccountCard(
                            displayName = account.displayName,
                            metaLine = "Game mode · Standard",
                            selected = selected,
                            gradient = dockingGradientForIndex(index),
                            onClick = { selectedId = account.id },
                        )
                    }
                    item {
                        DockingNewAccountSlot(
                            onClick = onCreateNewClick,
                            modifier = Modifier.padding(top = 4.dp),
                        )
                    }
                }
            }

            Spacer(Modifier.height(12.dp))
            Button(
                onClick = {
                    val id = selectedId ?: return@Button
                    val slot = accounts.find { it.id == id } ?: return@Button
                    onContinueWithAccount(slot)
                },
                enabled = selectedId != null && accounts.isNotEmpty(),
                modifier = Modifier.fillMaxWidth(),
                colors = ButtonDefaults.buttonColors(
                    containerColor = ArteriaPalette.AccentPrimary,
                    contentColor = Color.White,
                    disabledContainerColor = ArteriaPalette.BgCard,
                    disabledContentColor = ArteriaPalette.TextMuted,
                ),
            ) {
                Text("Enter timeline")
            }

            DockingLoreFooter(
                modifier = Modifier.align(Alignment.CenterHorizontally),
            )
        }
    }
}
