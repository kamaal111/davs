import React from 'react';

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
    const eventsToRemove: Partial<Record<TargetKey, Array<Event>>> = {};
    (
      Object.entries(inputRefs.current) as Array<
        [TargetKey, HTMLInputElement | null]
      >
    ).forEach(([key, ref]) => {
      if (!ref) return;

      const listenersHaveBeenAttached =
        listenersHaveBeenAttachedToRefs.current[key];
      if (listenersHaveBeenAttached) return;

      listenersHaveBeenAttachedToRefs.current[key] = true;
      eventsToRemove[key] = [];
      for (const event of events) {
        ref.addEventListener(event, event => {
          const newState = event.type as Event;
          setStates({ ...states, [key]: newState });
        });
        eventsToRemove[key].push(event);
      }
    });
  }, [events, states]);

  return { inputRefs, states };
}

export default useInputsStates;
