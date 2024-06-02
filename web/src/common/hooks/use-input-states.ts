import React from 'react';

function useInputStates<Event extends keyof HTMLElementEventMap>({
  events,
  defaultEvent,
}: {
  events: Array<Event>;
  defaultEvent?: Event;
}) {
  const [state, setState] = React.useState<Event | null>(defaultEvent ?? null);

  const inputRef = React.useRef<HTMLInputElement | null>(null);
  const listenersHaveBeenAttached = React.useRef(false);

  React.useEffect(() => {
    if (inputRef.current != null && !listenersHaveBeenAttached.current) {
      listenersHaveBeenAttached.current = true;
      for (const event of events) {
        inputRef.current.addEventListener(event, event => {
          const newState = event.type as Event;

          setState(newState);
        });
      }
    }

    return () => {
      for (const event of Object.values(events)) {
        inputRef.current?.removeEventListener(event, () => undefined);
      }
    };
  }, []);

  return { inputRef, state };
}

export default useInputStates;
