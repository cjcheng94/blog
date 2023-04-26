import { useContext } from "react";
import { ErrorContext, ErrorAlertContextType } from "@components";

const useErrorAlert = (): ErrorAlertContextType => {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error("useErrorAlert must be used within an ErrorAlertProvider");
  }
  return context;
};

export default useErrorAlert;
