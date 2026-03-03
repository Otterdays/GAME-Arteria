/**
 * Hook to show in-game feedback toasts (locked, no essence, etc.).
 * Replaces Alert.alert for blocking feedback — keeps UX in-game and stylized.
 * [TRACE: DOCU/zhip-ai-styling.md §7.3]
 */

import { useCallback } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { gameActions, type FeedbackToastType } from '@/store/gameSlice';

export function useFeedbackToast() {
    const dispatch = useAppDispatch();

    const showFeedbackToast = useCallback(
        (params: { type: FeedbackToastType; title: string; message: string }) => {
            dispatch(gameActions.pushFeedbackToast(params));
        },
        [dispatch]
    );

    return { showFeedbackToast };
}
