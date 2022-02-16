import { useEffect, useRef } from "react";

const useCleanup = <T>(cleanupFn: (args: T) => void, dependencies: T) => {
  const savedDependencies = useRef<T>();

  useEffect(() => {
    savedDependencies.current = dependencies;
  }, [dependencies]);

  useEffect(
    () => () => {
      cleanupFn(savedDependencies.current as T);
    },
    []
  );
};

export default useCleanup;
