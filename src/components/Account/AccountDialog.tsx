import React from "react";
import { TransitionProps } from "@material-ui/core/transitions";
import { Dialog, DialogContent, Slide, makeStyles } from "@material-ui/core";

import { Login, Signup } from "../../routes";

const useStyles = makeStyles(theme => ({
  dialogContent: {
    padding: "32px 24px",
    "&:first-child": {
      paddingTop: 32
    }
  }
}));

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" {...props} />;
});

type AccountActionType = "login" | "signup";

type AccountDialogProps = {
  open: boolean;
  type: AccountActionType;
  onClose: () => void;
  onTypeChange: (type: AccountActionType) => void;
};

const AccountDialog: React.FC<AccountDialogProps> = ({
  open,
  type,
  onClose,
  onTypeChange
}) => {
  const classes = useStyles();

  const renderLoginOrSignup = (type: "login" | "signup") => {
    if (type === "login") {
      return (
        <Login
          onCancel={onClose}
          onSuccess={onClose}
          goToSignup={() => onTypeChange("signup")}
        />
      );
    }
    return (
      <Signup
        onCancel={onClose}
        onSuccess={onClose}
        goToLogin={() => onTypeChange("login")}
      />
    );
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent classes={{ root: classes.dialogContent }}>
        {renderLoginOrSignup(type)}
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
