import React from 'react';

import type { StringUnion } from '@/types';

function useInputsStates<
  Event extends keyof HTMLElementEventMap,
  TargetKey extends string,
>({
  events,
  keys,
}: {
  events: Array<Event>;
  keys: Array<StringUnion<TargetKey>>;
}) {
  const [states, setStates] = React.useState(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<StringUnion<TargetKey>, Event | null>
    )
  );

  const inputRefs = React.useRef(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<StringUnion<TargetKey>, HTMLInputElement | null>
    )
  );
  const listenersHaveBeenAttachedToRefs = React.useRef(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<StringUnion<TargetKey>, boolean>
    )
  );

  React.useEffect(() => {
    (
      Object.entries(inputRefs.current) as Array<
        [StringUnion<TargetKey>, HTMLInputElement | null]
      >
    ).forEach(([key, ref]) => {
      if (!ref) return;

      const listenersHaveBeenAttached =
        listenersHaveBeenAttachedToRefs.current[key];
      if (listenersHaveBeenAttached) return;

      listenersHaveBeenAttachedToRefs.current[key] = true;
      for (const event of events) {
        ref.addEventListener(event, event => {
          const newState = event.type as Event;
          setStates({ ...states, [key]: newState });
        });
      }
    });
  }, []);

  return { inputRefs, states };
}

export default useInputsStates;
