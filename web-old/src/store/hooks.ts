import { useDispatch as reactReduxUseDispatch } from 'react-redux';

import type { AppDispatch } from './store';

export const useDispatch = reactReduxUseDispatch.withTypes<AppDispatch>();
