//Router configuration
import React, { Component } from "react";
import { Route } from "react-router-dom";

import CssBaseline from "@material-ui/core/CssBaseline";
import Snackbar from "@material-ui/core/Snackbar";
import { withStyles } from "@material-ui/core";

import Header from "../containers/Header";
import Main from "./Main";

const styles = {
  root: {
    fontFamily: "Roboto, sans-serif"
  },
  pageComponent: {
    padding: 24
  }
};

class App extends Component {
  state = {
    showAlert: false,
    alertMessage: "",
    alertDuration: 0
  };
  componentDidMount() {
    const isOnline = window.navigator.onLine;

    // Check if api request to "https://alexsblogapi.herokuapp.com/posts" is cached:
    caches.open("runtime-cache").then(cache =>
      cache.match("https://alexsblogapi.herokuapp.com/posts").then(res => {
        if (typeof res !== "undefined") {
          // Is indeed cached
          if (isOnline) {
            //Alert user posts are cached
            setTimeout(() => {
              this.setState({
                showAlert: true,
                alertMessage: "Posts cached for offline use",
                alertDuration: 2000
              });
            }, 1500);
          } else {
            // Alert user that they're in offline mode
            setTimeout(() => {
              this.setState({
                showAlert: true,
                alertMessage: "You are in offline mode",
                alertDuration: 2000
              });
            }, 1500);
          }
        }
      })
    );

    // Check the window.isUpdateAvailable promise that we defined in registerServiceWorker
    // it resolves to true if a new version is available.

    // Two reasons for the delay:
    //  1. To allow the 'posts cached' alert to display first, without interruption;
    //  2. There might be a race condition between this check and service worker registration,
    //     otherwise window.isUpdateAvailable will be undefined
    setTimeout(() => {
      try {
        window.isUpdateAvailable.then(isAvailable => {
          if (isAvailable) {
            // Alert user new version available
            this.setState({
              showAlert: true,
              alertMessage: "New version available, please refresh!",
              alertDuration: 2000
            });
          }
        });
      } catch (err) {
        //ignore errors
      }
    }, 4000);
  }
  hideAlert() {
    this.setState({ showAlert: false });
  }
  render() {
    const { classes } = this.props;
    const { showAlert, alertMessage, alertDuration } = this.state;
    return (
      <div className={classes.root}>
        <CssBaseline />

        {/* Header and main components */}
        <Route component={Header} />
        <Main />
        {/*----------------------------*/}
        
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={showAlert}
          autoHideDuration={alertDuration}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">{alertMessage}</span>}
        />
      </div>
    );
  }
}

export default withStyles(styles)(App);