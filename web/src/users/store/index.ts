import usersSlice from './slice';

export const { setSession } = usersSlice.actions;

export { selectSession } from './selectors';

export default usersSlice;
