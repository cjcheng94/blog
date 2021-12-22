import React, { useState, useEffect, FormEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import {
  makeStyles,
  Snackbar,
  Button,
  Typography,
  TextField
} from "@material-ui/core";
import { USER_SIGNUP } from "../gqlDocuments";
import { loadingVar } from "../cache";

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 32,
    "& button:first-child": {
      marginRight: 8
    }
  },
  bottomMessage: {
    margin: "8px 0px",
    height: "1em"
  },
  errorMessage: {
    color: theme.palette.error.main
  },
  loginText: {
    ...theme.typography.button,
    color: theme.palette.primary.main,
    fontWeight: 700,
    lineHeight: 1,
    paddingRight: 4,
    cursor: "pointer"
  }
}));

type Props = {
  onCancel: () => void;
  onSuccess: () => void;
  goToLogin: () => void;
};

const Signup: React.FC<Props> = ({ onSuccess, onCancel, goToLogin }) => {
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
        onSuccess();
      }, 1000);
    }
  }, [called, data]);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

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

  return (
    <div>
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

          <div className={classes.bottomMessage}>
            <span className={classes.errorMessage}>
              {error ? error?.message : ""}
            </span>
          </div>

          <div className={classes.bottomMessage}>
            <span>Already have an account? </span>
            <span className={classes.loginText} onClick={goToLogin}>
              Log in
            </span>
          </div>

          <div className={classes.buttonContainer}>
            <Button onClick={onCancel}>Cancel</Button>
            <Button
              disabled={loading}
              variant="contained"
              color="primary"
              type="submit"
            >
              Sign Up
            </Button>
          </div>
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
    </div>
  );
};

export default Signup;
