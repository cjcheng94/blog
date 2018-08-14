//Clear loader on component unmount
export const CLEAR_LOADER = "CLEAR_LOADER";

export function clearLoader() {
  return {
    type: CLEAR_LOADER
  };
}
