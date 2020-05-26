import React, { Fragment } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import { iRootState, Dispatch } from "../store";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Slide from "@material-ui/core/Slide";
import { TransitionProps } from "@material-ui/core/transitions";

const customMessage = {
  login: "Password Incorrect or user doesn't exist",
  signup: "User already exists",
  postNew: "Login expired, please log in again",
  postUpdate: "Unauthorized or Login expired, please log in again",
  postDetail: "Unauthorized or Login expired, please log in again"
};

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children?: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" {...props} />;
});

const mapState = (state: iRootState) => ({
  status: state.error.status,
  statusText: state.error.statusText,
  message: state.error.message
});

const mapDispatch = (dispatch: Dispatch) => ({
  clearError: dispatch.error.clearError
});

type connectedProps = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch>;

type Props = connectedProps & {
  type: string;
};

class ErrorAlert extends React.Component<Props> {
  render() {
    const { type, status, statusText, message, clearError } = this.props;
    return (
      <div>
        <Dialog
          open={!!status}
          TransitionComponent={Transition}
          keepMounted
          aria-labelledby="alert-dialog-slide-title"
          aria-describedby="alert-dialog-slide-description"
        >
          <DialogTitle>Oops, Something went wrong...</DialogTitle>
          <DialogContent>
            {
              //Only use custom messages when status is 401 or 409, otherwise show status & messages sent from server.
              status === 401 || status === 409 ? (
                <DialogContentText>{customMessage[type]}</DialogContentText>
              ) : (
                <Fragment>
                  <DialogContentText>
                    {status + " " + statusText}
                  </DialogContentText>
                  <DialogContentText>{message}</DialogContentText>
                </Fragment>
              )
            }
          </DialogContent>
          <DialogActions>
            <Button component={Link} to="/" color="secondary">
              Home
            </Button>
            <Button onClick={clearError} color="primary">
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default connect(mapState, mapDispatch)(ErrorAlert);
