'use client';

import React from 'react';
import { Provider } from 'react-redux';

import store from './store';
import type { Session } from '@/types';
import { setSession } from '@/users/store';

type Props = { children: React.ReactNode; session?: Session | null };

function StoreProvider({ children, session }: Props) {
  React.useEffect(() => {
    if (session != null) {
      store.dispatch(setSession(session));
    }
  }, [session]);

  return <Provider store={store}>{children}</Provider>;
}

export default StoreProvider;
