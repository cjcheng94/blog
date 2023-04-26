import React, { createContext, Dispatch } from "react";

export type ErrorType = Error | string | undefined;

export type ErrorAlertContextType = {
  error: ErrorType;
  showErrorAlert: Dispatch<ErrorType>;
};

const ErrorContext = createContext<ErrorAlertContextType | undefined>(
  undefined
);

export default ErrorContext;
