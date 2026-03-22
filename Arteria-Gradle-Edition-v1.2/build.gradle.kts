// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    id("com.android.application") version "9.1.0" apply false
    id("com.android.library") version "9.1.0" apply false
    // AGP 9+ built-in Kotlin compiles .kt without org.jetbrains.kotlin.android (do not apply both).
    id("org.jetbrains.kotlin.plugin.compose") version "2.0.0" apply false
}
