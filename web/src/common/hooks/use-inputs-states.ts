import React from 'react';

import toEntries from '@/common/objects/to-entries';

function useInputsStates<
  Event extends keyof HTMLElementEventMap,
  TargetKey extends string,
>({ events, keys }: { events: Array<Event>; keys: Array<TargetKey> }) {
  const [states, setStates] = React.useState(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<TargetKey, Event | null>
    )
  );

  const inputRefs = React.useRef(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: null }),
      {} as Record<TargetKey, HTMLInputElement | null>
    )
  );
  const listenersHaveBeenAttachedToRefs = React.useRef(
    keys.reduce(
      (acc, key) => ({ ...acc, [key]: false }),
      {} as Record<TargetKey, boolean>
    )
  );

  React.useEffect(() => {
    toEntries(inputRefs.current).forEach(([key, ref]) => {
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
  }, [events, states]);

  return { inputRefs, states };
}

export default useInputsStates;
