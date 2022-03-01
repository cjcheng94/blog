import React, { useState, useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import { indigo, pink, red } from "@material-ui/core/colors";
import { useReactiveVar } from "@apollo/client";
import {
  CssBaseline,
  Snackbar,
  useMediaQuery,
  MuiThemeProvider,
  createTheme,
  makeStyles
} from "@material-ui/core";
import * as registerServiceWorker from "../registerServiceWorker";
import {
  Header,
  Main,
  InstallAlert,
  SearchOverlay,
  AccountDialog
} from "@components";
import {
  darkModeVar,
  searchOverlayVar,
  accountDialogTypeVar
} from "../api/cache";

const useStyles = makeStyles(theme => {
  return {
    "@global": {
      ".MuiChip-colorPrimary": {
        border: "1px solid rgba(0,0,0,0)"
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
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  // Use a queue structure to show alerts one at a time
  const [alertQueue, setAlertQueue] = useState<Array<AlertItem>>([]);
  // True if user already installed or prefers not to install
  const [preventInstallAlert, setPreventInstallAlert] =
    useState<boolean>(false);
  const [showInstallSnackbar, setShowInstallSnackbar] =
    useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | undefined
  >(undefined);
  const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);

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
  const getCustomTheme = (mode: ThemeType) => {
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
  };

  const customTheme = React.useMemo(
    () => createTheme(getCustomTheme(userDarkModeSetting ? "dark" : "light")),
    [userDarkModeSetting]
  );

  const enqueueAlert = (item: AlertItem) => {
    setAlertQueue(prevQueue => [...prevQueue, item]);
  };

  const dequeueAlert = () => {
    setAlertQueue(prevQueue => prevQueue.slice(1));
  };

  useEffect(() => {
    registerServiceWorker.register({
      onSuccess: () => {
        enqueueAlert({
          type: "generic",
          message: "Content is cached for offline use"
        });
      },
      onUpdate: () => {
        // Alert user new version available
        enqueueAlert({
          type: "generic",
          message:
            "New content is available and will be used when all " +
            "tabs for this page are closed."
        });
      }
    });

    const onAppInstalled = () => {
      // Hide the app-provided install promotion
      setPreventInstallAlert(true);
      // Hide the custom install alert if it's currently up
      if (showInstallSnackbar) {
        setAlertQueue(prevQueue =>
          prevQueue.filter(alertItem => alertItem.type !== "install")
        );
        setShowInstallSnackbar(false);
      }
      // Clear the deferredPrompt so it can be garbage collected
      setDeferredPrompt(undefined);
      // Optionally, send analytics event to indicate successful install
      console.log("PWA was installed");
    };

    const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
      // Prevent the default prompt from showing
      e.preventDefault();
      // Stash the event so we can trigger it latter
      setDeferredPrompt(e);

      // Show custom install alert
      enqueueAlert({ type: "install", message: "" });
      console.log("beforeinstallprompt event was fired");
    };

    const updateIsOnline = () => {
      setIsOnline(true);
    };
    const updateOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    // Show an offline alert
    window.addEventListener("online", updateIsOnline);
    window.addEventListener("offline", updateOffline);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
      window.removeEventListener("online", updateIsOnline);
      window.removeEventListener("offline", updateOffline);
    };
  }, []);

  // Set dark mode by detecting system preference
  useEffect(() => {
    darkModeVar(prefersDarkMode);
  }, [prefersDarkMode]);

  // Show alerts one by one according to alertQueue
  useEffect(() => {
    // There's an alert currently being shown, don't show another
    if (showAlert || showInstallSnackbar) {
      return;
    }
    const firstItem = alertQueue[0];
    // Show the first alert in queue
    if (firstItem) {
      if (firstItem.type === "generic") {
        setShowAlert(true);
        setAlertMessage(firstItem.message);
        return;
      }
      // Don't show the alert if user prefers not to, or already installed
      if (preventInstallAlert) {
        return;
      }
      setShowInstallSnackbar(true);
    }
  }, [alertQueue]);

  const installHandler = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Trigger the install prompt
    deferredPrompt.prompt();
    // Avoid shoing custom alert again
    setPreventInstallAlert(true);
    // Get the user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Hide custom install alert
    setShowInstallSnackbar(false);
    dequeueAlert();
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(undefined);
  };

  return (
    <MuiThemeProvider theme={customTheme}>
      <CssBaseline />
      <div className={classes.root}>
        <Route component={Header} />
        {showSearchOverlay && <SearchOverlay />}
        {!!accountDialogType && <AccountDialog type={accountDialogType} />}
        <Main />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={showAlert}
          autoHideDuration={2000}
          onClose={() => {
            setShowAlert(false);
            dequeueAlert();
          }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{alertMessage}</span>}
        />
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={!isOnline}
          message="Offline"
        />
        <InstallAlert
          open={showInstallSnackbar}
          onHide={() => {
            setShowInstallSnackbar(false);
            dequeueAlert();
          }}
          onInstallClick={installHandler}
        />
      </div>
    </MuiThemeProvider>
  );
};

export default withRouter(App);
