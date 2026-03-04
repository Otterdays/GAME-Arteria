# STYLE_GUIDE

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

Project-specific conventions for Arteria code and docs. For visual/UI style, see **zhip-ai-styling.md**.

---

## 1. Trace Tags

Link code to docs with trace tags:

```ts
// [TRACE: DOCU/SCRATCHPAD.md]
// [TRACE: DOCU/ARCHITECTURE.md — Data Flow]
```

- Use when a file implements or depends on documented behavior.
- Format: `[TRACE: path — optional context]`
- Keep paths relative to repo root.

---

## 2. Code Limits

| Rule | Limit |
|------|-------|
| Line length | 100 chars |
| Function length | 50 lines |
| File length | 400 lines |

Split or extract when exceeding. Prefer smaller, focused modules.

---

## 3. Comment Prefixes

| Prefix | Meaning |
|--------|---------|
| `TODO:` | Planned work, not yet done |
| `FIXME:` | Known bug or hack to fix |
| `NOTE:` | Non-obvious rationale or caveat |

Use sparingly. Prefer types and clear naming over comments.

---

## 4. Naming Conventions

| Context | Convention | Example |
|---------|------------|---------|
| JS/TS | camelCase | `handleAltarPress` |
| Python | snake_case | `process_delta` |
| CSS | kebab-case | `section-card` |
| Constants | UPPER_SNAKE or PascalCase | `RUNE_ALTARS` |

---

## 5. Touch Targets (Mobile)

- **Settings rows:** Whole row is pressable (Pressable wraps label + Switch). Switch is display-only; row press toggles.
- **Skill nodes:** Use BouncyButton or TouchableOpacity for full-card hit area.
- Avoid `pointerEvents="none"` on interactive parents; use only when intentionally passing through (e.g. overlay).

---

## 6. Requirements Indicators

For craftable/skill nodes with multiple requirements (level, essence, narrative):

- Show compact badge row: `[Lv. X ✓] [emoji N/batch] [📖 Story]`
- Locked state: muted border, `reqBadgeLocked` style.
- Out-of-resource: red-tinted `reqBadgeEmpty` for essence badge.

---

## 7. Theming

- **Primary:** Use `useTheme().palette` for theme-aware colors. See DOCU/THEMING.md.
- **Phase 4 complete:** `Palette` export removed. Use `useTheme().palette` or `THEMES.dark` for fallback.
- **Tokens:** `bgApp`, `textPrimary`, `accentPrimary`, etc. — semantic names, not hex.
- **ThemeId:** `'system' | 'dark' | 'light' | 'sepia'`. Persisted in `player.settings.themeId`.

**Migration pattern (Phase 3):**
```ts
const { palette } = useTheme();
const styles = useMemo(
  () => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bgApp },
    // ... all color tokens from palette
  }),
  [palette]
);
```
- Child components that need themed styles receive `styles` as a prop.
- Layout tokens (`Spacing`, `Radius`, `FontSize`) stay as static imports — only color tokens move to `palette`.
- Override `CardStyle` colors: `...CardStyle, borderColor: palette.border`.

---

## 8. Build Scripts & App Identity

| Script | App Name | When to Use |
|--------|----------|-------------|
| `2_Build_APK_Local.bat` | **Arteria** | Shareable prod APK |
| `1_Run_Local_Android_Build.bat` | **Arteria-dev** | Dev client for Fast Refresh |

Both can coexist on the same device. `app.config.js` reads `ARTERIA_LEAN_PROD`; batch scripts set/unset it. See EXPO_GUIDE §5b.

---

## 9. Theme Tokens

Import from `@/constants/theme`:

| Token | Source | Use |
|-------|--------|-----|
| `palette.*` | `useTheme().palette` | Theme-aware colors (bgApp, bgCard, textPrimary, accentPrimary, gold, etc.) |
| `Spacing`, `Radius`, `FontSize` | Static import | Layout tokens (unchanged by theme) |
| `CardStyle` | Static import | Shared card border/shadow — override `borderColor` from `palette` when themed |
| `FontCinzel`, `FontCinzelBold` | Static import | Header fonts |
| `THEMES.dark` | Static import | Fallback palette (e.g. ErrorBoundary outside ThemeProvider). Prefer `useTheme().palette`. |

Avoid hardcoded hex in components. Use semantic tokens.
