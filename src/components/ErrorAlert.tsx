import React, { useState } from "react";
import { Link } from "react-router-dom";
import { TransitionProps } from "@material-ui/core/transitions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" {...props} />;
});

type ErrorAlertProps = {
  error: any;
};

const ErrorAlert: React.FC<ErrorAlertProps> = ({ error }) => {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div>
      <Dialog
        open={isOpen}
        TransitionComponent={Transition}
        keepMounted
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>Oops, Something went wrong...</DialogTitle>
        <DialogContent>{error?.message}</DialogContent>
        <DialogActions>
          <Button component={Link} to="/" color="secondary">
            Home
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
            }}
            color="primary"
          >
            Back
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ErrorAlert;
