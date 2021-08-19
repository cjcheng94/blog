import React, { useState, useEffect, Fragment, FormEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";
import {
  makeStyles,
  Snackbar,
  Button,
  Typography,
  TextField
} from "@material-ui/core";
import { ErrorAlert } from "@components";
import { USER_SIGNUP } from "../gqlDocuments";

const useStyles = makeStyles({
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  button: {
    display: "block",
    margin: "30px auto"
  },
  KAGGIGER: {
    color: "red"
  }
});

const Signup: React.FC<RouteComponentProps> = props => {
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] =
    useState("");
  const classes = useStyles();
  const [userSignup, { loading, error, data, called }] =
    useLazyQuery(USER_SIGNUP);

  // Clear error messages when user enters text
  useEffect(() => {
    if (username) {
      setUsernameErrorMessage("");
    }
    if (password) {
      setPasswordErrorMessage("");
    }
    if (confirmPassword) {
      setConfirmPasswordErrorMessage("");
    }
  }, [username, password, confirmPassword]);

  useEffect(() => {
    // Called Api and successfully signed up
    if (called && data) {
      setShowAlert(true);
      setTimeout(() => {
        props.history.push("/user/login");
      }, 1000);
    }
  }, [called, data]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();

    if (!username) {
      setUsernameErrorMessage("Please enter your username");
    }
    if (!password) {
      setPasswordErrorMessage("Please enter your password");
    }
    if (!confirmPassword) {
      setConfirmPasswordErrorMessage("Please confirm your password");
    }
    // User entered in confirm password field and it doesn't match
    if (confirmPassword && confirmPassword !== password) {
      setConfirmPasswordErrorMessage("Passwords doesn't match");
    }
    if (username && password && password === confirmPassword) {
      // Api call
      userSignup({
        variables: { username, password }
      });
    }
  };

  console.log(loading); //TODO

  return (
    <Fragment>
      {error && <ErrorAlert type="signup" />}
      <div className={classes.wrapper}>
        <Typography variant="h3" align="center">
          Sign up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            value={username}
            onChange={e => {
              setUsername(e.target.value);
            }}
            error={!!usernameErrorMessage}
            label={"Username"}
            type={"text"}
            helperText={usernameErrorMessage}
            margin="normal"
            fullWidth
          />
          <TextField
            value={password}
            onChange={e => {
              setPassword(e.target.value);
            }}
            error={!!passwordErrorMessage}
            label={"Password"}
            type={"password"}
            helperText={passwordErrorMessage}
            margin="normal"
            fullWidth
          />
          <TextField
            value={confirmPassword}
            onChange={e => {
              setConfirmPassword(e.target.value);
            }}
            error={!!confirmPasswordErrorMessage}
            label={"Confirm password"}
            type={"password"}
            helperText={confirmPasswordErrorMessage}
            margin="normal"
            fullWidth
          />
          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Sign Up
          </Button>
        </form>
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showAlert}
        autoHideDuration={3000}
        onClose={() => setShowAlert(false)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Sign up successful!</span>}
      />
    </Fragment>
  );
};

export default Signup;
