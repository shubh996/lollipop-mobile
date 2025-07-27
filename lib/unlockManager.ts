import { unlockTip } from '../redux/unlockedTipsSlice';
import { AppDispatch } from '../redux/store';

/**
 * Unlocks a tip by its ID and updates the global unlocked tips state.
 * @param tipId - The ID of the tip to unlock
 * @param dispatch - The Redux dispatch function
 */
export function unlockTipById(tipId: string, dispatch: AppDispatch) {
  dispatch(unlockTip(tipId));
}
