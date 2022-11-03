import React, { useEffect, useCallback } from "react";
import { Route } from "react-router-dom";
import { indigo, pink, red } from "@material-ui/core/colors";
import { useReactiveVar } from "@apollo/client";
import { CssBaseline, useMediaQuery } from "@material-ui/core";
import {
  makeStyles,
  createTheme,
  MuiThemeProvider
} from "@material-ui/core/styles";
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

const useStyles = makeStyles(theme => {
  return {
    "@global": {
      ".MuiChip-colorPrimary": {
        border: "1px solid rgba(0,0,0,0)"
      },
      figure: {
        margin: 0
      }
    },
    root: {
      fontFamily: "Roboto, sans-serif"
    }
  };
});

type AlertItem = {
  type: "generic" | "install";
  message: string;
};
type ThemeType = "light" | "dark";

const App: React.FC = () => {
  const userDarkModeSetting = useReactiveVar(darkModeVar);
  const showSearchOverlay = useReactiveVar(searchOverlayVar);
  const accountDialogType = useReactiveVar(accountDialogTypeVar);

  const classes = useStyles();

  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const getDefaultTheme = (mode: ThemeType) =>
    createTheme({
      palette: {
        type: mode
      }
    });

  // Temporary solution to dark mode palette
  const getCustomTheme = useCallback((mode: ThemeType) => {
    const defaultTheme = getDefaultTheme(mode);
    return {
      ...defaultTheme,
      palette: {
        ...(mode === "light"
          ? {
              // palette values for light mode
              ...defaultTheme.palette,
              type: mode,
              primary: { main: indigo[500] },
              secondary: { main: pink["A400"] },
              error: { main: red[500] }
            }
          : {
              // palette values for dark mode
              ...defaultTheme.palette,
              type: mode,
              primary: { main: indigo[200] },
              secondary: { main: pink["A100"] },
              error: { main: red[300] }
            })
      }
    };
  }, []);

  const customTheme = React.useMemo(
    () => createTheme(getCustomTheme(userDarkModeSetting ? "dark" : "light")),
    [getCustomTheme, userDarkModeSetting]
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
    <MuiThemeProvider theme={customTheme}>
      <SnackbarProvider>
        <CssBaseline />
        <ServiceWorkerAlerts />
        <InstallAlert />
        <div className={classes.root}>
          <Route component={Header} />
          {showSearchOverlay && <SearchOverlay />}
          {!!accountDialogType && <AccountDialog type={accountDialogType} />}
          <Main />
        </div>
      </SnackbarProvider>
    </MuiThemeProvider>
  );
};

export default App;
