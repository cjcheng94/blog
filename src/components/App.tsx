import React, { useEffect } from "react";
import { Route } from "react-router-dom";
import { useReactiveVar } from "@apollo/client";
import { CssBaseline, useMediaQuery } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import {
  Header,
  Main,
  InstallAlert,
  SearchOverlay,
  AccountDialog,
  ServiceWorkerAlerts
} from "@components";
import {
  darkModeVar,
  searchOverlayVar,
  accountDialogTypeVar
} from "../api/cache";
import { checkLocalStorageAuth, handleLocalStorageAuthDeletion } from "@utils";
import { SnackbarProvider } from "notistack";

type ThemeType = "light" | "dark";

const getDefaultTheme = (mode: ThemeType) =>
  createTheme({
    palette: {
      mode: mode
    }
  });

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
            error: { main: "#ba1a1a" }
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
      }
    }
  };
};

const App: React.FC = () => {
  const userDarkModeSetting = useReactiveVar(darkModeVar);
  const showSearchOverlay = useReactiveVar(searchOverlayVar);
  const accountDialogType = useReactiveVar(accountDialogTypeVar);
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const customTheme = React.useMemo(
    () => createTheme(getCustomTheme(userDarkModeSetting ? "dark" : "light")),
    [userDarkModeSetting]
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
        <ServiceWorkerAlerts />
        <InstallAlert />
        <Route component={Header} />
        {showSearchOverlay && <SearchOverlay />}
        {!!accountDialogType && <AccountDialog type={accountDialogType} />}
        <Main />
      </SnackbarProvider>
    </ThemeProvider>
  );
};

export default App;
