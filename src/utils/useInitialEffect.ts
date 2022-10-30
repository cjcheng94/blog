import { useEffect, useRef } from "react";

type CleanupFn = () => void;

type EffectCallback = () => void | CleanupFn;

const useInitialEffect = (effectCallback: EffectCallback) => {
  const initialRef = useRef(true);

  useEffect(() => {
    let cleanupFn;

    if (initialRef.current) {
      cleanupFn = effectCallback();
      initialRef.current = false;
    }

    return cleanupFn;
  }, [effectCallback]);
};

export default useInitialEffect;
