package com.arteria.game.navigation

object NavRoutes {
    const val AccountSelect = "account_select"
    const val AccountCreate = "account_create"
    const val PlayPlaceholder = "play/{accountName}"

    /** Path segment for [PlayPlaceholder]; name is URL-encoded for special characters. */
    fun playPath(accountName: String): String {
        val safe = android.net.Uri.encode(accountName)
        return "play/$safe"
    }
}
