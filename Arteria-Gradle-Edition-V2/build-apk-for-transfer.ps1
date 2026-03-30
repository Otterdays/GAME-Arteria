# Build an APK in this project and copy it to dist/ with a timestamp for Google Drive (or any transfer).
# Usage:
#   .\build-apk-for-transfer.ps1
#   .\build-apk-for-transfer.ps1 -Variant release
#   .\build-apk-for-transfer.ps1 -Clean
# Release builds require signing configured in app/build.gradle.kts; use debug if unsure.

param(
    [ValidateSet("debug", "release")]
    [string] $Variant = "debug",
    [switch] $Clean
)

$ErrorActionPreference = "Stop"
$root = $PSScriptRoot
Set-Location $root

$gradlew = Join-Path $root "gradlew.bat"
if (-not (Test-Path $gradlew)) {
    Write-Error "gradlew.bat not found in $root"
}

$task = if ($Variant -eq "release") { ":app:assembleRelease" } else { ":app:assembleDebug" }
$gradleArgs = @($task)
if ($Clean) {
    $gradleArgs = @("clean") + $gradleArgs
}

Write-Host "Gradle: gradlew.bat $($gradleArgs -join ' ')" -ForegroundColor Cyan
& $gradlew @gradleArgs
if ($LASTEXITCODE -ne 0) {
    Write-Error "Gradle failed with exit code $LASTEXITCODE"
}

$apkRoot = Join-Path $root "app/build/outputs/apk"
if (-not (Test-Path $apkRoot)) {
    Write-Error "No APK output at $apkRoot - check that the :app module built successfully."
}

$built = Get-ChildItem -Path $apkRoot -Recurse -Filter "*.apk" -File |
    Sort-Object LastWriteTime -Descending |
    Select-Object -First 1

if (-not $built) {
    Write-Error "No .apk found under $apkRoot after build."
}

$dist = Join-Path $root "dist"
New-Item -ItemType Directory -Path $dist -Force | Out-Null
$stamp = Get-Date -Format "yyyyMMdd-HHmmss"
$destName = "Arteria-v1.2-$Variant-$stamp.apk"
$dest = Join-Path $dist $destName

Copy-Item -LiteralPath $built.FullName -Destination $dest -Force
Write-Host ""
Write-Host "Copied transfer APK:" -ForegroundColor Green
Write-Host $dest
Write-Host ""
Write-Host 'Upload that file to Google Drive (or share however you like).' -ForegroundColor Gray
