import React, { useCallback } from "react";
import { TransitionProps } from "@mui/material/transitions";
import { Dialog, DialogContent, Slide } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

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
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

type AccountActionType = "login" | "signup";

const setAccountDialogType = (type: AccountActionType | "") => {
  accountDialogTypeVar(type);
};

type AccountDialogProps = {
  type: AccountActionType;
};

const AccountDialog: React.FC<AccountDialogProps> = ({ type }) => {
  const classes = useStyles();

  const onClose = useCallback(() => setAccountDialogType(""), []);
  const goToLogin = useCallback(() => setAccountDialogType("login"), []);
  const goToSignup = useCallback(() => setAccountDialogType("signup"), []);

  return (
    <Dialog
      open={true}
      onClose={onClose}
      TransitionComponent={Transition}
      aria-labelledby="form-dialog-title"
    >
      <DialogContent classes={{ root: classes.dialogContent }}>
        {type === "login" ? (
          <Login
            onCancel={onClose}
            onSuccess={onClose}
            goToSignup={goToSignup}
          />
        ) : (
          <Signup
            onCancel={onClose}
            onSuccess={onClose}
            goToLogin={goToLogin}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AccountDialog;
