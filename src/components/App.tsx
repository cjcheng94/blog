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

const App: React.FC = () => {
  const classes = useStyles();
  const [showAlert, setShowAlert] = useState<boolean>(false);
  const [showInstallSnackbar, setShowInstallSnackbar] = useState<boolean>(true);
  const [alertMessage, setAlertMessage] = useState<string>("");
  const [alertDuration, setAlertDuration] = useState<number>(0);
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

  useEffect(() => {
    registerServiceWorker.register({
      onSuccess: () => {
        setShowAlert(true);
        setAlertMessage("Content is cached for offline use");
        setAlertDuration(2000);
      },
      onUpdate: () => {
        // Alert user new version available
        setShowAlert(true);
        setAlertMessage(
          "New content is available and will be used when all " +
            "tabs for this page are closed."
        );
        setAlertDuration(2000);
      }
    });

    window.addEventListener("beforeinstallprompt", (e: Event) => {
      e.preventDefault();
      setShowInstallSnackbar(true);
      console.log("beforeinstallprompt event was fired");
    });
  }, []);

  // set dark mode by detecting system preference
  useEffect(() => {
    darkModeVar(prefersDarkMode);
  }, [prefersDarkMode]);

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
          autoHideDuration={alertDuration}
          onClose={() => {
            setShowAlert(false);
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
          }}
          onInstallClick={() => {}}
        />
      </div>
    </MuiThemeProvider>
  );
};

export default withRouter(App);
