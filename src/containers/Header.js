import React, { Component, Fragment } from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { compose } from "redux";

import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import AccountCircle from "@material-ui/icons/AccountCircle";
import Button from "@material-ui/core/Button";
import LinearProgress from "@material-ui/core/LinearProgress";
import Snackbar from "@material-ui/core/Snackbar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Tooltip from "@material-ui/core/Tooltip";

import CustomDialog from "../components/customDialog";
import { userLogout } from "../actions/user";

const styles = theme => ({
  toolBar: {
    justifyContent: "space-between"
  },
  brand: {
    fontFamily: "Notable, sans-serif",
    fontSize: "2.4em",
    textDecorationLine: "none",
    marginTop: -16,
    textShadow:
      "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)"
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  //A transparent place holder for progress bar,
  //avoids page jumping issues
  progressContainer: {
    height: 5,
    width: "100%",
    position: "fixed",
    top: 56,
    [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
      top: 48
    },
    [theme.breakpoints.up("sm")]: {
      top: 64
    }
  }
});

class Header extends Component {
  state = {
    openAlert: false,
    openCustomDialog: false,
    anchorEl: null
  };

  showAlert() {
    this.setState({ openAlert: true });
  }
  hideAlert() {
    this.setState({ openAlert: false });
  }
  showMenu(e) {
    this.setState({ anchorEl: e.currentTarget });
  }
  hideMenu() {
    this.setState({ anchorEl: null });
  }
  showCustomDialog() {
    this.setState({ openCustomDialog: true });
  }
  hideCustomDialog() {
    this.setState({ openCustomDialog: false });
  }
  handleLogoutClick(e) {
    e.preventDefault();
    this.props.userLogout(() => {
      this.hideCustomDialog();
      this.showAlert();
      setTimeout(() => this.props.history.push("/"), 1000);
    });
  }

  render() {
    const logo = window.innerWidth < 400 ? "B!" : "BLOG!";
    const { openAlert, openCustomDialog, anchorEl } = this.state;
    const { classes, isAuthenticated, username, isPending } = this.props;

    return (
      <Fragment>
        <AppBar position="sticky">
          <Toolbar className={classes.toolBar}>
            <Typography
              color="inherit"
              className={classes.brand}
              component={Link}
              to="/"
            >
              {logo}
            </Typography>
            
            {/* Show different sets of buttons based on whether user is signed in or not*/}
            <div id="conditional-buttons">
              {isAuthenticated ? (
                <Fragment>
                  <Tooltip title="My Account">
                    <IconButton
                      aria-haspopup="true"
                      color="inherit"
                      onClick={this.showMenu.bind(this)}
                    >
                      <AccountCircle />
                    </IconButton>
                  </Tooltip>
                  
                  <Menu
                    id="simple-menu"
                    anchorEl={anchorEl}
                    open={!!anchorEl}
                    onClose={this.hideMenu.bind(this)}
                  >
                    <MenuItem button={false}>{username}</MenuItem>
                    <MenuItem component={Link} to={`/user/profile/${username}`}>
                      My Posts
                    </MenuItem>
                    <MenuItem
                      onClick={this.showCustomDialog.bind(this)}
                      color="inherit"
                    >
                      Log Out
                    </MenuItem>
                  </Menu>
                </Fragment>
              ) : (
                <Fragment>
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
                </Fragment>
              )}
            </div>
          </Toolbar>

          <div className={classes.progressContainer}>
            {/* Show Progress Bar */}
            {isPending && <LinearProgress color="secondary" />}
          </div>
          
        </AppBar>
        {/* material-ui's Alert Component */}
        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={openAlert}
          autoHideDuration={4000}
          onClose={this.hideAlert.bind(this)}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Logout successful</span>}
        />
        <CustomDialog
          dialogTitle="Log Out?"
          open={openCustomDialog}
          handleClose={this.hideCustomDialog.bind(this)}
          handleConfirm={this.handleLogoutClick.bind(this)}
          isDisabled={false}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  isAuthenticated: state.user.isAuthenticated,
  username: state.user.username,
  isPending: state.isPending
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
