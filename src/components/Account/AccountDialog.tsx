import React from "react";
import { TransitionProps } from "@material-ui/core/transitions";
import { Dialog, DialogContent, Slide } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Login, Signup } from "@components";
import { accountDialogTypeVar } from "../../api/cache";

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

const setAccountDialogType = (type: AccountActionType | "") => () => {
  accountDialogTypeVar(type);
};

type AccountDialogProps = {
  type: AccountActionType;
};

const AccountDialog: React.FC<AccountDialogProps> = ({ type }) => {
  const classes = useStyles();

  const onClose = setAccountDialogType("");
  const goToLogin = setAccountDialogType("login");
  const goToSignup = setAccountDialogType("signup");

  const renderLoginOrSignup = (type: AccountActionType) => {
    if (type === "login") {
      return (
        <Login onCancel={onClose} onSuccess={onClose} goToSignup={goToSignup} />
      );
    }
    return (
      <Signup onCancel={onClose} onSuccess={onClose} goToLogin={goToLogin} />
    );
  };

  return (
    <Dialog
      open={true}
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
