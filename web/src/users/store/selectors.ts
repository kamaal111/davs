import type { RootState } from '@/store/store';

export function selectSession(state: RootState) {
  return state.users.session;
}
