import React, { useState, useEffect } from "react";
import { Route } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { CssBaseline, useMediaQuery } from "@mui/material";
import {
  createTheme,
  useTheme,
  ThemeProvider,
  ThemeOptions
} from "@mui/material/styles";
import { ObservableQuery } from "@apollo/client";

import {
  Header,
  Main,
  InstallAlert,
  SearchOverlay,
  AccountDialog,
  ServiceWorkerAlerts,
  ErrorAlertProvider
} from "@components";
import {
  darkModeVar,
  searchOverlayVar,
  accountDialogTypeVar
} from "../api/cache";
import { checkLocalStorageAuth, handleLocalStorageAuthDeletion } from "@utils";
import { SnackbarProvider } from "notistack";
import { SortingContext } from "@context";

type RefetchFn = ObservableQuery["refetch"];
type ThemeType = "light" | "dark";

const getDefaultTheme = (mode: ThemeType) =>
  createTheme({
    palette: {
      mode: mode
    }
  });

const App: React.FC = () => {
  const [refetchFn, setRefetchFn] = useState<RefetchFn | undefined>(undefined);
  const userDarkModeSetting = useReactiveVar(darkModeVar);
  const showSearchOverlay = useReactiveVar(searchOverlayVar);
  const accountDialogType = useReactiveVar(accountDialogTypeVar);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = useTheme();
  const smallAndDown = useMediaQuery(theme.breakpoints.down("sm"));

  const getCustomTheme = (mode: ThemeType) => {
    const defaultTheme = getDefaultTheme(mode);
    return {
      ...defaultTheme,
      mode,
      palette: {
        ...(mode === "light"
          ? {
              // palette values for light mode
              ...defaultTheme.palette,
              // type: mode,
              primary: { main: "#006399" },
              secondary: { main: "#67587a" },
              error: { main: "#ba1a1a" },
              background: { default: "#f7f7f7" }
            }
          : {
              // palette values for dark mode
              ...defaultTheme.palette,
              // type: mode,
              primary: { main: "#95ccff" },
              secondary: { main: "#d2bfe7" },
              error: { main: "#ffb4ab" }
            })
      },
      components: {
        MuiCssBaseline: {
          styleOverrides: `
            body {
              font-size: 0.875rem;
            },
          `
        },
        MuiChip: {
          styleOverrides: {
            filled: {
              border: "1px solid transparent"
            }
          }
        },
        MuiIconButton: {
          defaultProps: {
            size: smallAndDown ? "small" : "medium"
          }
        }
      }
    };
  };

  const customTheme = createTheme(
    getCustomTheme(userDarkModeSetting ? "dark" : "light") as ThemeOptions
  );

  useEffect(() => {
    // Persist auth from local storage
    checkLocalStorageAuth();

    // Detect if token is removed from local storage
    window.addEventListener("storage", handleLocalStorageAuthDeletion);
    return () => {
      window.removeEventListener("storage", handleLocalStorageAuthDeletion);
    };
  }, []);

  // Set dark mode by detecting system preference
  useEffect(() => {
    darkModeVar(prefersDarkMode);
  }, [prefersDarkMode]);

  return (
    <ThemeProvider theme={customTheme}>
      <CssBaseline />
      <SnackbarProvider>
        <ErrorAlertProvider>
          <SortingContext.Provider
            value={{
              refetchFn,
              updateRefetchFn: fn => {
                setRefetchFn(() => fn);
              }
            }}>
            <ServiceWorkerAlerts />
            <InstallAlert />
            <Route component={Header} />
            {showSearchOverlay && <SearchOverlay />}
            {!!accountDialogType && <AccountDialog type={accountDialogType} />}
            <Main />
          </SortingContext.Provider>
        </ErrorAlertProvider>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
