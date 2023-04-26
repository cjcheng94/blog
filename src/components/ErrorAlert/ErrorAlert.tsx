import React from "react";
import { Link } from "react-router-dom";
import { TransitionProps } from "@mui/material/transitions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from "@mui/material";
import { useNavigatorOnline } from "@utils";
import { useErrorAlert } from "@components";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const ErrorAlert = () => {
  const { error, showErrorAlert } = useErrorAlert();

  const isOnline = useNavigatorOnline();

  const offlineMessage =
    "Oops, you're in offline mode, please try again when you have an Internet connection";

  const errorMessage = () => {
    if (typeof error === "string") {
      return error;
    }
    if (!isOnline) {
      return offlineMessage;
    }
    if (error instanceof Error) {
      return error.message;
    }
  };

  const hideAlert = () => {
    showErrorAlert(undefined);
  };

  const message = errorMessage();

  return (
    <div>
      <Dialog
        open={true}
        TransitionComponent={Transition}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description">
        <DialogTitle>Oops, Something went wrong...</DialogTitle>
        <DialogContent>{message}</DialogContent>
        <DialogActions>
          <Button component={Link} onClick={hideAlert} to="/" color="secondary">
            Home
          </Button>
          <Button onClick={hideAlert} color="primary">
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorAlert;
