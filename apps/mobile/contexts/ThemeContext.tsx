/**
 * ThemeContext — Provides theme-aware palette and theme selection.
 * [TRACE: DOCU/THEMING.md]
 *
 * Use useTheme() for new components. Palette import remains for backward compat.
 */

import React, { createContext, useContext, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { useColorScheme } from '@/hooks/use-color-scheme';
import {
    THEMES,
    type PaletteShape,
    type ThemeId,
} from '@/constants/theme';

interface ThemeContextValue {
    palette: PaletteShape;
    themeId: ThemeId;
    setThemeId: (id: ThemeId) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

function resolvePalette(
    themeId: ThemeId,
    systemScheme: 'light' | 'dark' | null | undefined
): PaletteShape {
    if (themeId === 'system') {
        return systemScheme === 'light' ? THEMES.light : THEMES.dark;
    }
    return THEMES[themeId];
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const dispatch = useAppDispatch();
    const themeId = useAppSelector((s) => s.game.player.settings?.themeId ?? 'dark');
    const rawScheme = useColorScheme();
    const systemScheme = rawScheme === 'light' ? 'light' : 'dark';

    const value = useMemo<ThemeContextValue>(() => ({
        palette: resolvePalette(themeId, systemScheme),
        themeId,
        setThemeId: (id) => dispatch(gameActions.setThemeId(id)),
    }), [themeId, systemScheme, dispatch]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme(): ThemeContextValue {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return ctx;
}
