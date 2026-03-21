/**
 * Redux store for Arteria.
 */

import { configureStore } from '@reduxjs/toolkit';
import { gameSlice } from './gameSlice';
import { anchorSlice } from './anchorSlice';

export const store = configureStore({
    reducer: {
        game: gameSlice.reducer,
        anchor: anchorSlice.reducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
