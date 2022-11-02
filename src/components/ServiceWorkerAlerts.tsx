import React from "react";
import { useSnackbar } from "notistack";
import { IconButton, Button } from "@material-ui/core";
import { Close } from "@material-ui/icons";
import { useRegisterSW } from "virtual:pwa-register/react";
import { pwaInfo } from "virtual:pwa-info";

console.log(pwaInfo);

const ServiceWorkerAlerts = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const showOfflineReadyAlert = () => {
    const action = (snackbarId: string) => (
      <>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          <Close />
        </IconButton>
      </>
    );
    enqueueSnackbar("Content is cached for offline use", {
      action,
      variant: "success",
      autoHideDuration: 7 * 1000
    });
  };

  const showReloadAlert = () => {
    const action = (snackbarId: string) => (
      <>
        <Button
          onClick={() => {
            updateServiceWorker(true);
          }}
          style={{ color: "#fff" }}
        >
          Reload
        </Button>
        <IconButton
          size="small"
          aria-label="close"
          color="inherit"
          onClick={() => {
            closeSnackbar(snackbarId);
          }}
        >
          <Close />
        </IconButton>
      </>
    );

    enqueueSnackbar("New content is available", {
      action,
      variant: "info",
      autoHideDuration: null
    });
  };

  const { updateServiceWorker } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log(`Service worker registered`);
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    },
    onNeedRefresh: showReloadAlert,
    onOfflineReady: showOfflineReadyAlert
  });

  return null;
};

export default ServiceWorkerAlerts;
