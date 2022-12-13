import React, { useState, useEffect, useCallback } from "react";
import { Snackbar, Button, IconButton } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { Close } from "@mui/icons-material";

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.mode === "dark";
  const gradient = `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.light} 90%)`;
  const background = isDarkTheme ? "#fff" : gradient;
  return {
    root: {
      "& .MuiSnackbarContent-root": {
        color: theme.palette.background.default,
        background
      }
    },
    installBtn: {
      color: theme.palette.warning.light,
      fontWeight: "bold"
    }
  };
});

const InstallAlert = () => {
  const [showInstallSnackbar, setShowInstallSnackbar] =
    useState<boolean>(false);
  const [deferredPrompt, setDeferredPrompt] = useState<
    BeforeInstallPromptEvent | undefined
  >(undefined);
  const classes = useStyles();

  const onAppInstalled = useCallback(() => {
    // Hide the custom install alert if it's currently up
    if (showInstallSnackbar) {
      setShowInstallSnackbar(false);
    }
    // Clear the deferredPrompt so it can be garbage collected
    setDeferredPrompt(undefined);
    // Optionally, send analytics event to indicate successful install
    console.log("PWA was installed");
  }, [showInstallSnackbar]);

  const onBeforeInstallPrompt = (e: BeforeInstallPromptEvent) => {
    console.log("before install fired");

    // Prevent the default prompt from showing
    e.preventDefault();
    // Stash the event so we can trigger it latter
    setDeferredPrompt(e);

    // Show custom install alert
    setShowInstallSnackbar(true);
  };

  const onHide = () => {
    setShowInstallSnackbar(false);
  };

  const installHandler = async () => {
    if (!deferredPrompt) {
      return;
    }
    // Trigger the install prompt
    deferredPrompt.prompt();
    // Get the user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    // Hide custom install alert
    setShowInstallSnackbar(false);
    // We've used the prompt, and can't use it again, throw it away
    setDeferredPrompt(undefined);
  };

  useEffect(() => {
    window.addEventListener("appinstalled", onAppInstalled);
    window.addEventListener("beforeinstallprompt", onBeforeInstallPrompt);

    return () => {
      window.removeEventListener("appinstalled", onAppInstalled);
      window.removeEventListener("beforeinstallprompt", onBeforeInstallPrompt);
    };
  }, [onAppInstalled]);

  return (
    <Snackbar
      open={showInstallSnackbar}
      className={classes.root}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={
        <span>
          Installing use little storage and you can read posts even offline!
        </span>
      }
      action={
        <>
          <Button
            className={classes.installBtn}
            aria-haspopup="true"
            onClick={installHandler}
          >
            Install
          </Button>
          <IconButton
            aria-label="close"
            color="inherit"
            onClick={onHide}
            size="large"
          >
            <Close />
          </IconButton>
        </>
      }
    />
  );
};

export default InstallAlert;
