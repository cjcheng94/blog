import React from "react";
import { useRegisterSW } from "virtual:pwa-register/react";
import { SnackbarProvider, useSnackbar } from "notistack";
import {
  CssBaseline,
  Snackbar,
  useMediaQuery,
  Button
} from "@material-ui/core";

const ServiceWorker = () => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const {
    offlineReady: [offlineReady, setOfflineReady],
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker
  } = useRegisterSW({
    onRegisteredSW(swUrl, registration) {
      console.log(`Service Worker at: ${swUrl}`);
      // @ts-expect-error just ignore
      if (reloadSW === "true") {
        registration &&
          setInterval(() => {
            console.log("Checking for sw update");
            registration.update();
          }, 20000 /* 20s for testing purposes */);
      } else {
        console.log("SW Registered: " + registration);
      }
    },
    onRegisterError(error) {
      console.log("SW registration error", error);
    }
  });

  return null;
};

export default ServiceWorker;
