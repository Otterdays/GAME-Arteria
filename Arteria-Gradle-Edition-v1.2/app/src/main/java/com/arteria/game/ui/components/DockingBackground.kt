package com.arteria.game.ui.components

import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.lerp
import com.arteria.game.ui.theme.ArteriaPalette
import kotlin.math.PI
import kotlin.math.cos
import kotlin.math.sin
import kotlin.random.Random

/**
 * Animated deep-space backdrop for the Docking Station (main menu) and related flows.
 *
 * **Today:** twinkling starfield, slow aurora-style nebula blobs, gently breathing sky gradient.
 *
 * **Way forward (when you need more):**
 * - Respect **accessibility / reduced motion** (CompositionLocal or `isReduceMotionEnabled`) — hold last frame or static gradient.
 * - **Parallax** from scroll or accelerometer on supported devices.
 * - **Lightweight shader** (AGSL / RuntimeShader) for film grain or volumetric fog on flagship-only path.
 * - **Battery saver** hook: disable nebula layer or lengthen animation periods.
 */
private data class Star(
    val nx: Float,
    val ny: Float,
    val radius: Float,
    val baseAlpha: Float,
    val phase: Float,
    val speed: Float,
)

private data class Nebula(
    val nx: Float,
    val ny: Float,
    val radiusFrac: Float,
    val core: Color,
    val phase: Float,
    val driftA: Float,
    val driftB: Float,
)

@Composable
fun DockingBackground(modifier: Modifier = Modifier) {
    val infinite = rememberInfiniteTransition(label = "docking_space")
    val cosmic01 = infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(26_000, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "cosmic",
    ).value

    val twinkle01 = infinite.animateFloat(
        initialValue = 0f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            animation = tween(5_200, easing = LinearEasing),
            repeatMode = RepeatMode.Restart,
        ),
        label = "twinkle",
    ).value

    val stars = remember {
        val rnd = Random(42)
        List(78) {
            Star(
                nx = rnd.nextFloat(),
                ny = rnd.nextFloat() * 0.94f,
                radius = rnd.nextFloat() * 1.35f + 0.28f,
                baseAlpha = rnd.nextFloat() * 0.5f + 0.08f,
                phase = rnd.nextFloat() * 2f * PI.toFloat(),
                speed = rnd.nextFloat() * 1.15f + 0.65f,
            )
        }
    }

    val nebulae = remember {
        val rnd = Random(7)
        listOf(
            Nebula(
                nx = 0.22f,
                ny = 0.35f,
                radiusFrac = 0.55f,
                core = ArteriaPalette.AccentPrimary,
                phase = 0f,
                driftA = 1.1f,
                driftB = 0.85f,
            ),
            Nebula(
                nx = 0.78f,
                ny = 0.62f,
                radiusFrac = 0.48f,
                core = ArteriaPalette.AccentWeb,
                phase = rnd.nextFloat() * PI.toFloat(),
                driftA = 0.9f,
                driftB = 1.15f,
            ),
            Nebula(
                nx = 0.52f,
                ny = 0.18f,
                radiusFrac = 0.38f,
                core = ArteriaPalette.LuminarEnd,
                phase = rnd.nextFloat() * PI.toFloat(),
                driftA = 1.25f,
                driftB = 0.7f,
            ),
        )
    }

    val tau = cosmic01 * 2f * PI.toFloat()
    val twinkleAngle = twinkle01 * 2f * PI.toFloat()

    Box(modifier.fillMaxSize()) {
        Canvas(Modifier.fillMaxSize()) {
            val breath = 0.5f + 0.5f * sin(tau * 0.85f)
            val midShift = lerp(
                ArteriaPalette.BgDeepSpaceMid,
                Color(0xFF071018),
                breath * 0.35f,
            )
            val bottomShift = lerp(
                ArteriaPalette.BgDeepSpaceBottom,
                Color(0xFF0a0e22),
                0.5f + 0.5f * sin(tau * 0.6f + 1.2f) * 0.22f,
            )

            drawRect(
                brush = Brush.verticalGradient(
                    colors = listOf(
                        ArteriaPalette.BgDeepSpaceTop,
                        midShift,
                        bottomShift,
                    ),
                ),
            )

            val w = size.width
            val h = size.height
            val minDim = minOf(w, h)

            for (n in nebulae) {
                val ox = n.nx * w + sin(tau * n.driftA + n.phase) * w * 0.045f
                val oy = n.ny * h + cos(tau * n.driftB + n.phase * 1.3f) * h * 0.038f
                val r = minDim * n.radiusFrac
                val center = Offset(ox, oy)
                drawCircle(
                    brush = Brush.radialGradient(
                        colors = listOf(
                            n.core.copy(alpha = 0.10f),
                            n.core.copy(alpha = 0.03f),
                            Color.Transparent,
                        ),
                        center = center,
                        radius = r,
                    ),
                    radius = r,
                    center = center,
                )
            }

            for (s in stars) {
                val wobble = 0.38f + 0.62f * ((sin(twinkleAngle * s.speed + s.phase) + 1f) * 0.5f)
                val slowPulse = 0.88f + 0.12f * ((sin(tau * 0.4f + s.phase) + 1f) * 0.5f)
                val alpha = (s.baseAlpha * wobble * slowPulse).coerceIn(0.04f, 0.95f)
                val rPulse = s.radius * (0.94f + 0.06f * sin(twinkleAngle * s.speed * 1.1f + s.phase))
                drawCircle(
                    color = Color.White.copy(alpha = alpha),
                    radius = rPulse,
                    center = Offset(s.nx * w, s.ny * h),
                )
            }
        }
    }
}
