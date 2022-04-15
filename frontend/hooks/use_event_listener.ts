import {useEffect, useRef} from "react";

const useEventListener = (eventName: string, handler: Function, element: Node) => {
  const savedHandler = useRef<Function | null>(null);

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
    }
  }, [eventName, element]);
}

export default useEventListener;
