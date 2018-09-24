import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { userLogout } from "../actions/user";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import { compose } from "redux";

const styles = {
  appBar: {},
  brand: {
    flexGrow: 1,
    fontSize: "2.4em",
    textShadow: "2px 2px 0px #b2ebf2, 4px 4px 0px #4dd0e1, 6px 6px 0px #00bcd4"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  barColorPrimary: {
    backgroundColor: "#00695C"
  },
  colorPrimary: {
    backgroundColor: "#B2DFDB"
  }
};
class Header extends Component {
  state = {
    open: false
  };
  showAlert() {
    this.setState({
      open: true
    });
  }
  hideAlert() {
    this.setState({
      open: false
    });
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.userLogout(() => {
      this.showAlert();
      setTimeout(() => this.props.history.push("/"), 1000);
    });
  }

  render() {
    const logo = window.innerWidth < 400 ? "B!" : "BLOG!";
    const { classes, isAuthenticated } = this.props;
    const { open } = this.state;

    return (
      <div>
        <AppBar className={classes.appBar} position="static">
          <Toolbar>
            <Typography
              variant="title"
              color="inherit"
              className={classes.brand}
              component={Link}
              to="/"
            >
              {logo}
            </Typography>
            {isAuthenticated ? (
              <div>
                <IconButton
                  aria-haspopup="true"
                  color="inherit"
                  component={Link}
                  to={`/user/profile/${this.props.username}`}
                >
                  <AccountCircle />
                </IconButton>
                <Button
                  aria-haspopup="true"
                  onClick={this.handleLogoutClick.bind(this)}
                  color="inherit"
                >
                  Log Out
                </Button>
              </div>
            ) : (
              <div>
                <Button
                  aria-haspopup="true"
                  color="inherit"
                  component={Link}
                  to="/user/login"
                >
                  Log In
                </Button>
                <Button
                  aria-haspopup="true"
                  color="inherit"
                  component={Link}
                  to="/user/signup"
                >
                  Sign Up
                </Button>
              </div>
            )}
          </Toolbar>
        </AppBar>
        {this.props.isPending ? (
          <LinearProgress
            classes={{
              colorPrimary: classes.colorPrimary,
              barColorPrimary: classes.barColorPrimary
            }}
          />
        ) : (
          <div style={{ height: 5 }} />
        )}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={open}
          autoHideDuration={4000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Logged Out</span>}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  isPending,
  user: { isAuthenticated, username }
}) => ({
  isAuthenticated,
  isPending,
  username
});

export default compose(
  withStyles(styles, {
    name: "Header"
  }),
  connect(
    mapStateToProps,
    { userLogout }
  )
)(Header);
