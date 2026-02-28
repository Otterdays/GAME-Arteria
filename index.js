/**
 * Monorepo root entry: Gradle/Metro runs from Arteria, so it looks for ./index.js here.
 * Redirects to the actual app entry in apps/mobile.
 */
require("./apps/mobile/index.js");
