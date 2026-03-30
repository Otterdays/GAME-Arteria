# Theming Architecture

> [!WARNING]
> **ATTENTION:** Do NOT remove or delete existing texts, updates, docs, or anything else in this document. Only append, compact, or update.

> **Status:** Phase 2–4 complete (2026-03-04). All components use useTheme(). Static `Palette` export removed.

---

## 1. Overview

Arteria uses a **semantic palette** — components reference tokens like `bgApp`, `textPrimary`, `accentPrimary` — not raw hex. Themes swap the values behind those tokens.

**Goals:**
- Multiple themes (dark, light, sepia, etc.) without touching component code.
- User-selectable theme, persisted with save.
- Optional "system" mode (follow OS light/dark).
- All consumers use `useTheme().palette` or `THEMES.dark` for fallback (Phase 4 complete).

---

## 2. Theme Shape

Each theme is a `PaletteShape` — same keys as current `Palette`:

| Category | Tokens |
|----------|--------|
| Backgrounds | `bgApp`, `bgCard`, `bgCardHover`, `bgInput` |
| Text | `textPrimary`, `textSecondary`, `textDisabled`, `textMuted` |
| Accent | `accentPrimary`, `accentHover`, `accentDim`, `accentWeb`, `borderGlow` |
| Semantic | `gold`, `goldDim`, `green`, `greenDim`, `red`, `redDim` |
| Borders | `border`, `divider` |
| Misc | `purple`, `white`, `black`, `transparent` |
| Skills | `skillMining`, `skillLogging`, … (per-skill colors) |

**Design choice:** Skill colors can stay fixed (mining = copper) or vary per theme. For now, keep them in the palette; themes can override if desired.

---

## 3. Theme Registry

```ts
// constants/theme.ts
export const THEMES: Record<ThemeId, PaletteShape> = {
  dark: { /* current Palette values */ },
  light: { /* inverted / light values */ },
  sepia: { /* warm, low-contrast */ },
};

export type ThemeId = 'system' | 'dark' | 'light' | 'sepia';
```

- `system` → resolve at runtime from `useColorScheme()` (light or dark).
- Named themes → use that palette directly.

---

## 4. Theme Context

```ts
// contexts/ThemeContext.tsx
interface ThemeContextValue {
  palette: PaletteShape;   // Current resolved palette
  themeId: ThemeId;        // User selection
  setThemeId: (id: ThemeId) => void;
}

export function useTheme(): ThemeContextValue;
```

- **Provider** wraps the app (inside Redux so it can read `player.settings.themeId`).
- **Resolution:** If `themeId === 'system'`, use `useColorScheme()` → pick `THEMES.dark` or `THEMES.light`. Else use `THEMES[themeId]`.
- **Persistence:** `setThemeId` dispatches `gameActions.setThemeId(id)` → stored in `player.settings.themeId` → MMKV.

---

## 5. Persistence

| Location | Key | Default |
|----------|-----|---------|
| Redux | `player.settings.themeId` | `'dark'` |
| MMKV | Part of `player` save | — |

Add to `gameSlice`:
- `settings.themeId?: ThemeId`
- `setThemeId` action
- Migration in `loadPlayer` to default `themeId` to `'dark'` for existing saves.

---

## 6. React Navigation Integration ✅

`paletteToNavigationTheme(palette)` builds a React Navigation theme from our palette. `NavThemeWrapper` uses `useTheme().palette` and passes the result to `ThemeProvider`. Tab bar, headers, and StatusBar now follow the selected theme. Luminance from `bgApp` determines `dark` for StatusBar (light text on dark bg, dark text on light bg).

---

## 7. Migration Path

| Phase | Action |
|-------|--------|
| **Now** | `Palette` remains the default export (= `THEMES.dark`). No breaking changes. |
| **Phase 1** | New components use `useTheme().palette` instead of `Palette`. |
| **Phase 2** | Add Settings row: "Theme" → picker (System / Dark / Light / Sepia). Wire `setThemeId`. ✅ |
| **Phase 3** | Gradually replace `Palette` imports with `useTheme().palette` in existing components. Nav ThemeProvider + tab bar + StatusBar wired. ✅ |
| **Phase 4** | Remove static `Palette` export; all consumers use context. ✅ |

**Phase 4 complete (2026-03-04):** Removed `Palette` export from theme.ts. ErrorBoundary uses THEMES.dark (outside ThemeProvider). constants/skills.ts uses THEMES.dark. Colors, CardStyle use DARK_PALETTE internally.

---

## 7b. Migration Pattern (Phase 3)

```ts
const { palette } = useTheme();
const styles = useMemo(
  () => StyleSheet.create({
    container: { flex: 1, backgroundColor: palette.bgApp },
    header: { borderBottomColor: palette.border, backgroundColor: palette.bgCard },
    // ... all color tokens from palette
  }),
  [palette]
);
```

- **Child components:** Pass `styles` as a prop when they need themed styles.
- **Layout tokens:** `Spacing`, `Radius`, `FontSize` stay as static imports.
- **CardStyle:** Override colors: `...CardStyle, borderColor: palette.border`.
- **Inline overrides:** `style={[styles.x, { color: palette.gold }]}` when needed.

---

## 8. CardStyle & Dynamic Tokens

`CardStyle` currently uses `Palette.border`, `Palette.accentWeb`. When theme-aware:

- Option A: `CardStyle` becomes a function `getCardStyle(palette)`.
- Option B: Components that use `CardStyle` also use `palette` for the color overrides.

Prefer B for simplicity: keep `CardStyle` as layout/shadow config; override `borderColor`, `shadowColor` from `palette` where needed.

---

## 9. File Layout

```
apps/mobile/
├── constants/
│   └── theme.ts          # PaletteShape, THEMES, Spacing, Radius, FontSize, Fonts
├── contexts/
│   └── ThemeContext.tsx  # ThemeProvider, useTheme
├── store/
│   └── gameSlice.ts      # settings.themeId, setThemeId
└── app/(tabs)/settings.tsx  # Theme picker row (Phase 2)
```

---

## 10. Future: Custom Themes

Long-term, users could define custom palettes (e.g. "High contrast", "OLED black"). That would require:

- Storing custom palettes in MMKV (or a separate store).
- A theme editor UI.
- Validation that all required keys are present.

Out of scope for the light architecture.
