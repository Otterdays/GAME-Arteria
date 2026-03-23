package com.arteria.game.ui

import androidx.compose.runtime.Composable
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.navigation.NavType
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import androidx.navigation.navArgument
import com.arteria.game.navigation.NavRoutes
import com.arteria.game.ui.account.AccountCreationScreen
import com.arteria.game.ui.account.AccountSelectionScreen
import com.arteria.game.ui.account.AccountSlot
import com.arteria.game.ui.account.PlayPlaceholderScreen
import java.util.UUID

@Composable
fun ArteriaApp(modifier: Modifier = Modifier) {
    val navController = rememberNavController()
    val accounts = remember {
        mutableStateListOf(
            AccountSlot(id = "demo-1", displayName = "Demo adventurer"),
        )
    }

    NavHost(
        navController = navController,
        startDestination = NavRoutes.AccountSelect,
        modifier = modifier,
    ) {
        composable(NavRoutes.AccountSelect) {
            AccountSelectionScreen(
                accounts = accounts,
                onCreateNewClick = { navController.navigate(NavRoutes.AccountCreate) },
                onContinueWithAccount = { slot ->
                    navController.navigate(NavRoutes.playPath(slot.displayName))
                },
            )
        }
        composable(NavRoutes.AccountCreate) {
            AccountCreationScreen(
                onBack = { navController.popBackStack() },
                onCreateAccount = { name ->
                    accounts.add(AccountSlot(id = UUID.randomUUID().toString(), displayName = name))
                    navController.popBackStack()
                },
            )
        }
        composable(
            route = NavRoutes.PlayPlaceholder,
            arguments = listOf(
                navArgument("accountName") { type = NavType.StringType },
            ),
        ) { entry ->
            val raw = entry.arguments?.getString("accountName").orEmpty()
            val name = android.net.Uri.decode(raw)
            PlayPlaceholderScreen(
                accountDisplayName = name,
                onBackToAccounts = {
                    navController.popBackStack(NavRoutes.AccountSelect, inclusive = false)
                },
            )
        }
    }
}
