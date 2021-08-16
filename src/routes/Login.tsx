import React, { useState, useEffect, Fragment, FormEvent } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import { RouteComponentProps } from "react-router-dom";
import {
  makeStyles,
  Snackbar,
  Button,
  Typography,
  TextField
} from "@material-ui/core";
import { ErrorAlert } from "@components";
import { currentUsernameVar, tokenVar } from "../cache";

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 300,
    margin: "0px auto"
  },
  button: {
    display: "block",
    margin: "30px auto"
  }
}));

const USER_LOGIN = gql`
  query userLogin($username: String!, $password: String!) {
    userLogin(username: $username, password: $password)
  }
`;

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
      return;
    }
  }, [username]);

  useEffect(() => {
    if (password) {
      setPasswordErrorMessage("");
      return;
    }
  }, [password]);

  useEffect(() => {
    // Called Api and successfully got token
    if (called && data) {
      const token = data.userLogin;

      currentUsernameVar(username);
      tokenVar(token);
      localStorage.setItem("currentUsername", username);
      localStorage.setItem("token", token);

      setShowAlert(true);
      setTimeout(() => props.history.push("/"), 1000);
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

    if (username && password) {
      // Api call
      userLogin({
        variables: { username, password }
      });
    }
  };

  console.log(loading); //TODO

  return (
    <Fragment>
      {error && <ErrorAlert type="login" />}

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
    </Fragment>
  );
};

export default Login;
