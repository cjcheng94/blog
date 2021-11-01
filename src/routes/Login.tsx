import React, { useState, useEffect, FormEvent } from "react";
import { useLazyQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";
import {
  makeStyles,
  Snackbar,
  Button,
  Typography,
  TextField,
  Paper
} from "@material-ui/core";
import { ErrorAlert } from "@components";
import { USER_LOGIN } from "../gqlDocuments";
import { loadingVar } from "../cache";

const useStyles = makeStyles(theme => ({
  paper: {
    maxWidth: 400,
    margin: "auto",
    padding: theme.spacing(2)
  },
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  button: {
    display: "block",
    margin: "30px auto"
  }
}));

type Props = RouteComponentProps;

const Login: React.FC<Props> = props => {
  const [showAlert, setShowAlert] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameErrorMessage, setUsernameErrorMessage] = useState("");
  const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
  const classes = useStyles();
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
      localStorage.setItem("currentUsername", username);
      localStorage.setItem("currentUserToken", token);
      localStorage.setItem("currentUserId", userId);

      setShowAlert(true);
      setTimeout(() => props.history.push("/"), 1000);
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

    if (username && password) {
      // Api call
      userLogin({
        variables: { username, password }
      });
    }
  };

  return (
    <Paper className={classes.paper} elevation={3}>
      {error && <ErrorAlert error={error} />}
      <div className={classes.wrapper}>
        <Typography variant="h3" align="center">
          Log in
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

          <Button
            className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
          >
            Log In
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
        message={<span id="message-id">Login successful!</span>}
      />
    </Paper>
  );
};

export default Login;
