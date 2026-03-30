package com.arteria.game.ui.theme

import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import com.arteria.game.R

/**
 * Dark-first palette aligned with `apps/mobile/constants/theme.ts` (DARK_PALETTE +
 * character-select "Docking Station" gradient).
 */
object ArteriaPalette {
    val BgDeepSpaceTop = Color(0xFF020408)
    val BgDeepSpaceMid = Color(0xFF060D16)
    val BgDeepSpaceBottom = Color(0xFF080B1A)

    val BgApp = Color(0xFF0F111A)
    val BgCard = Color(0xFF1B1E29)
    val BgCardHover = Color(0xFF232636)
    val BgInput = Color(0xFF161825)

    val TextPrimary = Color(0xFFE8E9ED)
    val TextSecondary = Color(0xFF8B8FA3)
    val TextMuted = Color(0xFF6C7085)

    val AccentPrimary = Color(0xFF4A90E2)
    val AccentHover = Color(0xFF6AA3F5)
    val AccentWeb = Color(0xFF8B5CF6)
    val Gold = Color(0xFFF59E0B)
    val GoldDim = Color(0xFFC49B1A)

    val Border = Color(0xFF2B2F3D)
    val Divider = Color(0xFF252837)

    val LuminarEnd = Color(0xFF5B8CFF)
    val VoidAccent = Color(0xFF9B59B6)
    val BalancedEnd = Color(0xFF2ECC71)
}

private val ArteriaDarkScheme = darkColorScheme(
    primary = ArteriaPalette.AccentPrimary,
    onPrimary = Color.White,
    primaryContainer = Color(0xFF3A6DB5),
    onPrimaryContainer = Color(0xFFE8E9ED),
    secondary = ArteriaPalette.Gold,
    onSecondary = Color(0xFF1A1204),
    tertiary = ArteriaPalette.AccentWeb,
    onTertiary = Color.White,
    background = ArteriaPalette.BgDeepSpaceTop,
    onBackground = ArteriaPalette.TextPrimary,
    surface = ArteriaPalette.BgCard,
    onSurface = ArteriaPalette.TextPrimary,
    surfaceVariant = ArteriaPalette.BgCardHover,
    onSurfaceVariant = ArteriaPalette.TextSecondary,
    outline = ArteriaPalette.Border,
    outlineVariant = ArteriaPalette.Divider,
)

/**
 * **Cinzel** — matches Expo `Cinzel_400Regular` / `Cinzel_700Bold` (`apps/mobile` root layout).
 * Bundled variable font: `res/font/cinzel.ttf` ([google/fonts ofl/cinzel](https://github.com/google/fonts/tree/main/ofl/cinzel), OFL).
 */
private val Cinzel = FontFamily(
    Font(R.font.cinzel, FontWeight.Normal, FontStyle.Normal),
    Font(R.font.cinzel, FontWeight.Medium, FontStyle.Normal),
    Font(R.font.cinzel, FontWeight.SemiBold, FontStyle.Normal),
    Font(R.font.cinzel, FontWeight.Bold, FontStyle.Normal),
)

private val ArteriaTypography = Typography(
    displaySmall = TextStyle(
        fontFamily = Cinzel,
        fontWeight = FontWeight.Bold,
        fontSize = 28.sp,
        lineHeight = 34.sp,
        letterSpacing = 1.5.sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = Cinzel,
        fontWeight = FontWeight.Bold,
        fontSize = 22.sp,
        letterSpacing = 0.5.sp,
    ),
    titleLarge = TextStyle(
        fontFamily = Cinzel,
        fontWeight = FontWeight.Bold,
        fontSize = 18.sp,
    ),
    titleMedium = TextStyle(
        fontFamily = Cinzel,
        fontWeight = FontWeight.SemiBold,
        fontSize = 16.sp,
    ),
    bodyLarge = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 16.sp,
        lineHeight = 22.sp,
    ),
    bodyMedium = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 14.sp,
        lineHeight = 19.sp,
    ),
    bodySmall = TextStyle(
        fontFamily = FontFamily.SansSerif,
        fontWeight = FontWeight.Normal,
        fontSize = 12.sp,
        lineHeight = 17.sp,
    ),
    labelSmall = TextStyle(
        fontFamily = Cinzel,
        fontWeight = FontWeight.Bold,
        fontSize = 10.sp,
        letterSpacing = 3.sp,
    ),
)

@Composable
fun ArteriaTheme(content: @Composable () -> Unit) {
    MaterialTheme(
        colorScheme = ArteriaDarkScheme,
        typography = ArteriaTypography,
        content = content,
    )
}
