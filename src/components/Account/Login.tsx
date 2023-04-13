import React, { useState, useEffect, FormEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import { Button, Typography, TextField } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useSnackbar } from "notistack";

import { USER_LOGIN } from "../../api/gqlDocuments";
import { loadingVar } from "../../api/cache";
import { saveAuth, useNavigatorOnline } from "@utils";

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
    margin: "8px 0px"
  },
  errorMessage: {
    color: theme.palette.error.main
  },
  buttonText: {
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
  goToSignup: () => void;
};

const Login: React.FC<Props> = ({ onCancel, onSuccess, goToSignup }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const classes = useStyles();

  const { enqueueSnackbar } = useSnackbar();

  const isOnline = useNavigatorOnline();

  const [userLogin, { loading, error, data, called }] =
    useLazyQuery(USER_LOGIN);

  // Clear error messages when user enters text
  useEffect(() => {
    if (username) {
      setUsernameErrorMessage("");
    }
    if (password) {
      setPasswordErrorMessage("");
    }
  }, [username, password]);

  useEffect(() => {
    // Called Api and successfully got token
    if (called && data) {
      const { token, username, userId } = data.userLogin;
      saveAuth({ token, username, userId });
      enqueueSnackbar("Login successful!");
      setTimeout(() => onSuccess(), 1000);
    }
  }, [called, data, enqueueSnackbar, onSuccess]);

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

    if (username && password) {
      // Api call
      userLogin({
        variables: { username, password }
      });
    }
  };

  const getErrorMessage = () => {
    if (isOnline && error) {
      return error?.message;
    }
    if (!isOnline) {
      return "Oops, you're in offline mode, please try again when you have an Internet connection";
    }
    return "";
  };

  return (
    <div className={classes.wrapper}>
      <Typography variant="h3" align="center">
        Log in
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          variant="standard"
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
          variant="standard"
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

        <div className={classes.bottomMessage}>
          <div className={classes.errorMessage}>{getErrorMessage()}</div>
        </div>

        <div className={classes.bottomMessage}>
          <span>Don&#39;t have an account? </span>
          <span className={classes.buttonText} onClick={goToSignup}>
            Sign up
          </span>
        </div>

        <div className={classes.buttonContainer}>
          <Button onClick={onCancel}>Cancel</Button>
          <Button
            disabled={loading}
            variant="contained"
            color="primary"
            type="submit">
            Log In
          </Button>
        </div>
      </form>
    </div>
  );
};

export default Login;
