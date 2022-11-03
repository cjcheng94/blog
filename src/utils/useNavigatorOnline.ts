import { useSyncExternalStore } from "use-sync-external-store/shim";

function subscribe(callback: () => void) {
  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
const useNavigatorOnLine = () =>
  useSyncExternalStore(
    subscribe,
    () => navigator.onLine,
    () => true
  );

export default useNavigatorOnLine;
