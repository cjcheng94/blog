import React, { useState, useEffect } from "react";
import { Route, withRouter } from "react-router-dom";
import * as registerServiceWorker from "../registerServiceWorker";
import { darkModeVar } from "../cache";
import {
  CssBaseline,
  Snackbar,
  useMediaQuery,
  MuiThemeProvider,
  createTheme,
  makeStyles
} from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { Header, Main, InstallAlert } from "@components";
import { GET_IS_DARK_MODE } from "../gqlDocuments";

const useStyles = makeStyles(theme => ({
  "@global": {
    ".richEditorBlockQuote": {
      color: "red",
      fontFamily: "Georgia, serif",
      fontStyle: "italic",
      textAlign: "center",
      fontSize: "2em"
    }
  },
  root: {
    fontFamily: "Roboto, sans-serif"
  }
}));

type AlertItem = {
  type: "generic" | "install";
  message: string;
};

const App: React.FC = () => {
  const classes = useStyles();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showInstallSnackbar, setShowInstallSnackbar] =
    useState<boolean>(false);
  const [alertMessage, setAlertMessage] = useState<string>("");
  // Use a queue structure to show alerts one at a time
  const [alertQueue, setAlertQueue] = useState<Array<AlertItem>>([]);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | undefined
  >(undefined);
  const { data } = useQuery(GET_IS_DARK_MODE);

  const userDarkModeSetting = data.isDarkMode;
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          type: userDarkModeSetting ? "dark" : "light"
        }
      }),
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

    window.addEventListener(
      "beforeinstallprompt",
      (e: BeforeInstallPromptEvent) => {
        // Prevent the default prompt from showing
        e.preventDefault();
        // Stash the event so we can trigger it latter
        setDeferredPrompt(e);
        // Show custom install alert
        enqueueAlert({ type: "install", message: "" });
        console.log("beforeinstallprompt event was fired");
      }
    );
  }, []);

  // Set dark mode by detecting system preference
  useEffect(() => {
    darkModeVar(prefersDarkMode);
  }, [prefersDarkMode]);

  // Show alerts one by one according to alertQueue
  useEffect(() => {
    console.log(alertQueue);
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
      setShowInstallSnackbar(true);
    }
  }, [alertQueue]);

  const installHandler = async () => {
    // Hide custom install alert
    setShowInstallSnackbar(false);
    dequeueAlert();

    if (!deferredPrompt) {
      return;
    }

    // Trigger the install prompt
    deferredPrompt.prompt();

    // Get the user choice
    const { outcome } = await deferredPrompt.userChoice;

    console.log(`User response to the install prompt: ${outcome}`);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(undefined);
  };

  console.log({ deferredPrompt });

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      <div className={classes.root}>
        <Route component={Header} />
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
