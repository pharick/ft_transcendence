import {useEffect, useRef} from "react";

const useInterval = (callback: Function, delay: number) => {
  const savedCallback = useRef<Function | null>(null);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const intervalId = setInterval(() => { savedCallback.current?.() }, delay);
    return () => clearInterval(intervalId);
  });
};

export default useInterval;
