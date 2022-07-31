import { useEffect, useRef } from 'react';

const useKeyboardEventListener = (
  eventName: string,
  handler: EventListener,
  element: Node,
) => {
  const savedHandler = useRef<EventListener | null>(null);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: Event) => savedHandler.current?.(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export default useKeyboardEventListener;
