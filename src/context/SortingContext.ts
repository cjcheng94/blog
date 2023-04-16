import { createContext, Dispatch, SetStateAction } from "react";
import { ObservableQuery } from "@apollo/client";

type RefetchFn = ObservableQuery["refetch"];

type SortingContextType = {
  refetchFn: RefetchFn | undefined;
  updateRefetchFn: (fn: RefetchFn) => void;
};
const SortingContext = createContext<SortingContextType>({
  refetchFn: undefined,
  updateRefetchFn: (fn: RefetchFn) => {}
});

export default SortingContext;
