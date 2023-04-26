import React, { useState, ReactNode } from "react";
import { ErrorAlert, ErrorContext, ErrorType } from "@components";

const ErrorAlertProvider = ({ children }: { children: ReactNode }) => {
  const [error, setError] = useState<ErrorType>();

  const isOpen = error !== undefined;

  return (
    <ErrorContext.Provider value={{ error, showErrorAlert: setError }}>
      {children}
      {isOpen && <ErrorAlert />}
    </ErrorContext.Provider>
  );
};

export default ErrorAlertProvider;
