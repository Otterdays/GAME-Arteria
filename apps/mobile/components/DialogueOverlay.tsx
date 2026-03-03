import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Modal, TouchableWithoutFeedback } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { gameActions } from '@/store/gameSlice';
import { Spacing, FontSize, Radius } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { BouncyButton } from './BouncyButton';
import { IconSymbol } from '@/components/ui/icon-symbol';

// NOTE: Hardcoded import until alias is linked properly across monorepo
// @ts-ignore
import { ALL_DIALOGUES } from '../../../packages/engine/src/data/dialogues';
// @ts-ignore
import { DialogueOption } from '../../../packages/engine/src/data/story';
// @ts-ignore
import { meetsNarrativeRequirement } from '../../../packages/engine/src/utils/narrative';

export function DialogueOverlay() {
    const { palette } = useTheme();
    const dispatch = useAppDispatch();
    const activeDialogue = useAppSelector((state) => state.game.activeDialogue);
    const player = useAppSelector((state) => state.game.player);
    const insets = useSafeAreaInsets();

    const styles = useMemo(
        () =>
            StyleSheet.create({
                overlay: { flex: 1, justifyContent: 'flex-end' },
                backdrop: {
                    ...StyleSheet.absoluteFillObject,
                    backgroundColor: 'rgba(0, 0, 0, 0.6)',
                },
                dialogueContainer: {
                    backgroundColor: palette.bgApp,
                    borderTopLeftRadius: Radius.xl,
                    borderTopRightRadius: Radius.xl,
                    padding: Spacing.lg,
                    borderTopWidth: 1,
                    borderLeftWidth: 1,
                    borderRightWidth: 1,
                    borderColor: palette.border,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: -10 },
                    shadowOpacity: 0.5,
                    shadowRadius: 20,
                    elevation: 20,
                },
                speakerBox: {
                    alignSelf: 'flex-start',
                    backgroundColor: palette.accentPrimary,
                    paddingHorizontal: Spacing.md,
                    paddingVertical: 6,
                    borderRadius: Radius.sm,
                    marginBottom: Spacing.md,
                    transform: [{ translateY: -30 }],
                },
                speakerName: {
                    color: palette.white,
                    fontWeight: '800',
                    fontSize: FontSize.md,
                    letterSpacing: 0.5,
                },
                textBox: {
                    marginBottom: Spacing.xl,
                    marginTop: -10,
                },
                dialogueText: {
                    color: palette.textPrimary,
                    fontSize: FontSize.lg,
                    lineHeight: 28,
                },
                optionsContainer: { gap: Spacing.sm },
                optionButton: {
                    backgroundColor: palette.bgCard,
                    borderWidth: 1,
                    borderColor: palette.border,
                    paddingVertical: Spacing.md,
                    paddingHorizontal: Spacing.lg,
                    borderRadius: Radius.md,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                },
                optionDisabled: {
                    backgroundColor: palette.bgApp,
                    borderColor: 'transparent',
                    opacity: 0.6,
                },
                optionText: {
                    color: palette.textSecondary,
                    fontSize: FontSize.md,
                    fontWeight: '600',
                    flex: 1,
                },
                optionTextDisabled: { color: palette.textDisabled },
            }),
        [palette]
    );

    if (!activeDialogue) return null;

    const tree = ALL_DIALOGUES[activeDialogue.treeId];
    if (!tree) return null;

    const node = tree.nodes[activeDialogue.nodeId];
    if (!node) return null;

    const handleSelectOption = (option: typeof node.options[0]) => {
        // Handle side-effects of choosing this option
        if (option.onSelect) {
            if (option.onSelect.setFlags) {
                option.onSelect.setFlags.forEach((flag: string) => dispatch(gameActions.setNarrativeFlag(flag)));
            }
            if (option.onSelect.startQuest) {
                dispatch(gameActions.startQuest(option.onSelect.startQuest));
            }
            if (option.onSelect.completeQuestStep) {
                dispatch(gameActions.completeQuestStep(option.onSelect.completeQuestStep));
            }
            // TODO: handle giveItems / removeItems when inventory refactor is complete
        }

        // Move to next node or close
        dispatch(gameActions.selectDialogueOption(option.nextNodeId));
    };

    return (
        <Modal
            transparent
            visible={!!activeDialogue}
            animationType="fade"
            onRequestClose={() => dispatch(gameActions.selectDialogueOption('end'))}
        >
            <View style={styles.overlay}>
                <TouchableWithoutFeedback onPress={() => { }}>
                    <View style={styles.backdrop} />
                </TouchableWithoutFeedback>

                <View style={[styles.dialogueContainer, { paddingBottom: insets.bottom + Spacing.xl }]}>
                    <View style={styles.speakerBox}>
                        <Text style={styles.speakerName}>{node.speaker}</Text>
                    </View>

                    <View style={styles.textBox}>
                        <Text style={styles.dialogueText}>{node.text}</Text>
                    </View>

                    <View style={styles.optionsContainer}>
                        {node.options.map((opt: DialogueOption) => {
                            const meetsReq = meetsNarrativeRequirement(player, opt.requirements);
                            return (
                                <BouncyButton
                                    key={opt.id}
                                    style={[styles.optionButton, !meetsReq && styles.optionDisabled]}
                                    onPress={() => meetsReq && handleSelectOption(opt)}
                                    disabled={!meetsReq}
                                >
                                    <Text style={[styles.optionText, !meetsReq && styles.optionTextDisabled]}>
                                        {opt.text}
                                    </Text>
                                    {!meetsReq && <IconSymbol name="lock.fill" size={16} color={palette.textDisabled} />}
                                </BouncyButton>
                            );
                        })}
                    </View>
                </View>
            </View>
        </Modal>
    );
}

