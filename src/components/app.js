//Router configuration
import React, { Component } from "react";

import CssBaseline from "@material-ui/core/CssBaseline";
import Snackbar from "@material-ui/core/Snackbar";

import Routes from './routes'

export default class App extends Component {
  state = {
    showAlert: false,
    alertMessage: "",
    alertDuration: 0
  };
  componentDidMount() {
    const isOnline = window.navigator.onLine;

    caches.has("posts").then(isCached => {
      if (isCached && isOnline) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
            alertMessage: "Posts cached for offline use",
            alertDuration: 2000
          });
        }, 1500);
      } else if (isCached && !isOnline) {
        setTimeout(() => {
          this.setState({
            showAlert: true,
            alertMessage: "You are in offline mode",
            alertDuration: 2000
          });
        }, 1500);
      }
    });

    setTimeout(() => {
      try {
        window.isUpdateAvailable.then(isAvailable => {
          if (isAvailable) {
            this.setState({
              showAlert: true,
              alertMessage: "New version available, please refresh!",
              alertDuration: 2000
            });
          }
        });
      } catch (err) {
        //ignore
      }
    }, 4000);
  }
  hideAlert() {
    this.setState({ showAlert: false });
  }
  render() {

    const { showAlert, alertMessage, alertDuration } = this.state;
    return (
      <div>
        <CssBaseline />
        <Routes />
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
