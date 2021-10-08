import React, { useState, Fragment } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { darkModeVar } from "../cache";
import {
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  LinearProgress,
  Snackbar,
  Menu,
  MenuItem,
  makeStyles
} from "@material-ui/core";
import { AccountCircle, Brightness4 } from "@material-ui/icons";
import { CustomDialog } from "@components";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { GET_IS_LOADING } from "../gqlDocuments";

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.type === "dark";
  return {
    toolBar: {
      justifyContent: "space-between",
      backgroundColor: isDarkTheme ? "#333" : theme.palette.primary.main
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
  };
});

const toggleDarkMode = () => {
  const prevIsDarkMode = darkModeVar();
  darkModeVar(!prevIsDarkMode);
};

type UserLogout = (callback: () => void) => void;
const userLogout: UserLogout = callback => {
  localStorage.removeItem("currentUserToken");
  localStorage.removeItem("currentUsername");
  localStorage.removeItem("currentUserId");

  callback();
};

type HeaderProps = RouteComponentProps;
const Header: React.FC<HeaderProps> = ({ history }) => {
  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [openCustomDialog, setOpenCustomDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const { data } = useQuery(GET_IS_LOADING);
  const classes = useStyles();

  const { isLoading } = data;
  const isAuthenticated = !checkIfExpired();
  const currentUsername = localStorage.getItem("currentUsername");
  const currentUserId = localStorage.getItem("currentUserId");

  const showMenu = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const showCustomDialog = () => {
    setOpenCustomDialog(true);
  };

  const hideCustomDialog = () => {
    setOpenCustomDialog(false);
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const logoutCallback = () => {
      hideCustomDialog();
      setShowLogoutAlert(true);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    };

    userLogout(logoutCallback);
  };

  const getUserPath = () => {
    if (!!currentUsername) {
      return `/user/profile/${currentUserId}?username=${encodeURIComponent(
        currentUsername
      )}`;
    }
    return "";
  };

  const logo = window.innerWidth < 400 ? "B!" : "BLOG!";

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
            <IconButton
              title="Toggle darkmode"
              aria-haspopup="true"
              color="inherit"
              onClick={toggleDarkMode}
            >
              <Brightness4 />
            </IconButton>
            <Fragment>
              <Tooltip title="My Account">
                <IconButton
                  aria-haspopup="true"
                  color="inherit"
                  onClick={showMenu}
                >
                  <AccountCircle />
                </IconButton>
              </Tooltip>

              <Menu
                id="simple-menu"
                anchorEl={anchorEl}
                open={!!anchorEl}
                onClose={hideMenu}
              >
                {isAuthenticated ? (
                  <>
                    <MenuItem button={false}>{currentUsername}</MenuItem>
                    <MenuItem component={Link} to={getUserPath()}>
                      My Posts
                    </MenuItem>
                    <MenuItem onClick={showCustomDialog} color="inherit">
                      Log Out
                    </MenuItem>
                  </>
                ) : (
                  <>
                    <MenuItem component={Link} to={"/user/login"}>
                      Log In
                    </MenuItem>
                    <MenuItem component={Link} to={"/user/signup"}>
                      Sign Up
                    </MenuItem>
                  </>
                )}
              </Menu>
            </Fragment>
          </div>
        </Toolbar>

        <div className={classes.progressContainer}>
          {/* Show Progress Bar */}
          {isLoading && <LinearProgress color="secondary" />}
        </div>
      </AppBar>
      {/* material-ui's Alert Component */}
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showLogoutAlert}
        autoHideDuration={4000}
        onClose={() => setShowLogoutAlert(false)}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Logout successful</span>}
      />
      <CustomDialog
        dialogTitle="Log Out?"
        open={openCustomDialog}
        handleClose={hideCustomDialog}
        handleConfirm={handleLogoutClick}
        isDisabled={false}
      />
    </Fragment>
  );
};

export default Header;
