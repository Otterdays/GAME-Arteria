/**
 * Hook to start or switch tasks with optional "Confirm Task Switch" prompt.
 * When the player has an active task and tries to start a different one,
 * and Settings → Confirm Task Switch is on, shows an Alert before switching.
 * [TRACE: ROADMAP Phase 7.3 / Settings]
 */

import { useCallback } from 'react';
import { Alert } from 'react-native';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions, type ActiveTask } from '@/store/gameSlice';

export function useRequestStartTask() {
    const dispatch = useAppDispatch();
    const activeTask = useAppSelector((s) => s.game.player.activeTask);
    const confirmTaskSwitch = useAppSelector(
        (s) => s.game.player.settings?.confirmTaskSwitch ?? false
    );

    const requestStartTask = useCallback(
        (payload: ActiveTask) => {
            const isSameTask =
                activeTask?.actionId === payload.actionId &&
                activeTask?.skillId === payload.skillId;
            if (!activeTask || isSameTask) {
                dispatch(gameActions.startTask(payload));
                return;
            }
            if (confirmTaskSwitch) {
                Alert.alert(
                    'Switch task?',
                    'You are already training something else. Switch and lose current progress on this tick?',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        {
                            text: 'Switch',
                            onPress: () => dispatch(gameActions.startTask(payload)),
                        },
                    ]
                );
                return;
            }
            dispatch(gameActions.startTask(payload));
        },
        [activeTask, confirmTaskSwitch, dispatch]
    );

    return requestStartTask;
}
