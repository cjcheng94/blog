import React from "react";
import { TransitionProps } from "@material-ui/core/transitions";
import {
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Slide
} from "@material-ui/core";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" {...props} />;
});

type DialogProps = {
  dialogTitle: string;
  open: boolean;
  isDisabled: boolean;
  type?: "submit" | "reset" | "button";
  formId?: string;
  handleClose: (e: React.MouseEvent) => void;
  handleConfirm?: (e: React.MouseEvent) => void;
};

const CustomDialog: React.FC<DialogProps> = props => {
  const {
    dialogTitle,
    open,
    handleClose,
    handleConfirm,
    isDisabled,
    type,
    formId
  } = props;

  return (
    <div>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        onClose={handleClose}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">{dialogTitle}</DialogTitle>
        <DialogActions style={{ justifyContent: "space-evenly" }}>
          <Button onClick={handleClose} color="primary">
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            color="secondary"
            disabled={isDisabled}
            type={type}
            form={formId}
          >
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default CustomDialog;
