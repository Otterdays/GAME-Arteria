/**
 * Maps actionId to human-readable display name for toasts.
 */
import { MINING_NODES } from '@/constants/mining';

export function getActionDisplayName(skillId: string, actionId: string): string {
  if (skillId === 'mining') {
    const node = MINING_NODES.find((n) => n.id === actionId);
    return node ? node.name : actionId.replace(/_/g, ' ');
  }
  return actionId.replace(/_/g, ' ');
}
