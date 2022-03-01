import React, { useState, useEffect, Fragment } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useQuery, useReactiveVar } from "@apollo/client";
import {
  darkModeVar,
  searchOverlayVar,
  drawerVar,
  loadingVar,
  sortLatestFirstVar,
  accountDialogTypeVar
} from "../api/cache";
import {
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  LinearProgress,
  Snackbar,
  Menu,
  MenuList,
  MenuItem,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  makeStyles
} from "@material-ui/core";
import {
  Edit,
  Label,
  Search,
  Brightness4,
  AccountCircle,
  ChevronLeft,
  Sort,
  ExitToApp,
  LibraryBooks,
  Menu as MenuIcon,
  Drafts as DraftIcon
} from "@material-ui/icons";
import {
  CustomDialog,
  EditTagDialog,
  ErrorAlert,
  AutosaveSpinner
} from "@components";
import checkIfExpired from "../utils/checkTokenExpired";
import { GET_ALL_TAGS } from "../api/gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.type === "dark";
  const drawerWidth = 240;

  return {
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
    },
    drawerPaper: {
      width: drawerWidth,
      [theme.breakpoints.down("xs")]: {
        width: "100%"
      }
    },
    drawerHeader: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(0, 1),
      ...theme.mixins.toolbar,
      justifyContent: "flex-end"
    },
    appBar: {
      color: "#fff",
      backgroundColor: isDarkTheme ? "#333" : theme.palette.primary.main,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen
      })
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      transition: theme.transitions.create(["margin", "width"], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      [theme.breakpoints.down("xs")]: {
        width: "initial",
        marginLeft: 0
      }
    },
    centerAligned: {
      display: "flex",
      alignItems: "center"
    },
    menuButton: {
      marginRight: theme.spacing(1)
    },
    hideXsUp: {
      display: "none",
      [theme.breakpoints.down("xs")]: {
        display: "initial"
      }
    },
    listIcons: {
      minWidth: "initial",
      marginRight: theme.spacing(1)
    },
    listText: {
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    },
    menuIcon: {
      marginRight: 8
    }
  };
});

const toggleDarkMode = () => {
  const prevIsDarkMode = darkModeVar();
  darkModeVar(!prevIsDarkMode);
};

const toggleSorting = () => {
  const prevLatestFirst = sortLatestFirstVar();
  sortLatestFirstVar(!prevLatestFirst);
};

const toggleSearchOverlay = () => {
  const prevShowSearchOverlay = searchOverlayVar();
  searchOverlayVar(!prevShowSearchOverlay);
};

const setShowDrawer = (state: boolean) => () => {
  drawerVar(state);
};

const showAccountDialog = (type: "login" | "signup") => {
  accountDialogTypeVar(type);
};

type UserLogout = (callback: () => void) => void;
const userLogout: UserLogout = callback => {
  localStorage.removeItem("currentUserToken");
  localStorage.removeItem("currentUsername");
  localStorage.removeItem("currentUserId");

  callback();
};

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

type HeaderProps = RouteComponentProps;

const Header: React.FC<HeaderProps> = ({ history, location }) => {
  const getInitialTagIds = () => {
    if (location.pathname === "/posts/tags") {
      const urlQuery = getUrlQuery(location.search);
      const tagIds = urlQuery.getAll("tagIds");
      return tagIds;
    }
    return [];
  };

  const [showLogoutAlert, setShowLogoutAlert] = useState<boolean>(false);
  const [showCustomDialog, setShowCustomDialog] = useState<boolean>(false);
  const [showEditTagDialog, setShowEditTagDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);
  const [selectedTagIds, setSelectedTagIds] =
    useState<string[]>(getInitialTagIds);

  const classes = useStyles();
  const isLoading = useReactiveVar(loadingVar);
  const showDrawer = useReactiveVar(drawerVar);
  const sortLatestFirst = useReactiveVar(sortLatestFirstVar);

  // Get all tags to render searched tags
  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: getTagsData
  } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  useEffect(() => {
    // Reset selected tags when user goes back to index page
    if (location.pathname === "/") {
      setSelectedTagIds([]);
    }
  }, [location.pathname]);

  useEffect(() => {
    // There are selected tags, go to postsByTags page
    if (selectedTagIds.length > 0) {
      handleSearch();
      return;
    }

    // Return to index page when no tags are selected AND we're in /tags route (prevent going to homepage on page refresh)
    if (location.pathname === "/posts/tags") {
      history.push("/");
    }
  }, [selectedTagIds]);

  const isAuthenticated = !checkIfExpired();
  const currentUsername = localStorage.getItem("currentUsername");
  const currentUserId = localStorage.getItem("currentUserId");

  const showMenu = (e: React.MouseEvent) => {
    setAnchorEl(e.currentTarget);
  };

  const hideMenu = () => {
    setAnchorEl(null);
  };

  const openAccountDialog = (type: "login" | "signup") => () => {
    showAccountDialog(type);
    hideMenu();
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();

    const logoutCallback = () => {
      setShowCustomDialog(false);
      setShowLogoutAlert(true);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    };

    userLogout(logoutCallback);
  };

  const handleTagSelect = (tagId: string) => (e: React.MouseEvent) => {
    setSelectedTagIds(prevList => {
      if (prevList.includes(tagId)) {
        return prevList.filter(id => id !== tagId);
      }
      return [...prevList, tagId];
    });
  };

  // Go to PostsByTags page and pass selected tagIds in query string
  const handleSearch = () => {
    const searchParams = new URLSearchParams();
    selectedTagIds.forEach(tagId => {
      searchParams.append("tagIds", tagId);
    });
    const queryString = searchParams.toString();
    const postsByTagsUrl = `/posts/tags?${queryString}`;
    history.push(postsByTagsUrl);
  };

  const isTagSelected = (tagId: string) => selectedTagIds.includes(tagId);

  const getUserPath = () => {
    if (!!currentUsername) {
      return `/user/profile/${currentUserId}?username=${encodeURIComponent(
        currentUsername
      )}`;
    }
    return "";
  };

  const renderTags = () => {
    if (getTagsLoading || !getTagsData?.tags) return;
    return getTagsData.tags.map(tag => (
      <ListItem
        button
        key={tag._id}
        title={tag.name}
        onClick={handleTagSelect(tag._id)}
        selected={isTagSelected(tag._id)}
      >
        <ListItemIcon className={classes.listIcons}>
          <Label />
        </ListItemIcon>
        <ListItemText
          primary={tag.name}
          primaryTypographyProps={{ className: classes.listText }}
        />
      </ListItem>
    ));
  };

  const logo = window.innerWidth < 400 ? "B!" : "BLOG!";
  const sortButtonText = sortLatestFirst ? "Latest first" : "Oldest first";

  const appBarClass = showDrawer
    ? `${classes.appBar} ${classes.appBarShift}`
    : classes.appBar;

  const menuButtonClass = showDrawer
    ? `${classes.menuButton} ${classes.hideXsUp}`
    : classes.menuButton;

  return (
    <Fragment>
      {getTagsError && <ErrorAlert error={getTagsError} />}
      <AppBar position="sticky" className={appBarClass}>
        <Toolbar className={classes.toolBar}>
          <div className={classes.centerAligned}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={setShowDrawer(true)}
              edge="start"
              className={menuButtonClass}
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color="inherit"
              className={classes.brand}
              component={Link}
              to="/"
            >
              {logo}
            </Typography>
          </div>
          {/* Show different sets of buttons based on whether user is signed in or not*/}
          <div id="conditional-buttons">
            <AutosaveSpinner />
            <Tooltip title="Search">
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={toggleSearchOverlay}
              >
                <Search />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle darkmode">
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={toggleDarkMode}
              >
                <Brightness4 />
              </IconButton>
            </Tooltip>
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
                  <MenuList>
                    <MenuItem button={false}>
                      <AccountCircle className={classes.menuIcon} />
                      <span>{currentUsername}</span>
                    </MenuItem>
                    <MenuItem
                      component={Link}
                      to={getUserPath()}
                      onClick={hideMenu}
                    >
                      <LibraryBooks className={classes.menuIcon} />
                      My Posts
                    </MenuItem>
                    <MenuItem component={Link} to="/drafts" onClick={hideMenu}>
                      <DraftIcon className={classes.menuIcon} />
                      Drafts
                    </MenuItem>
                    <MenuItem
                      onClick={() => {
                        setShowCustomDialog(true);
                        hideMenu();
                      }}
                      color="inherit"
                    >
                      <ExitToApp className={classes.menuIcon} />
                      Log Out
                    </MenuItem>
                  </MenuList>
                ) : (
                  <MenuList>
                    <MenuItem onClick={openAccountDialog("login")}>
                      Log In
                    </MenuItem>
                    <MenuItem onClick={openAccountDialog("signup")}>
                      Sign Up
                    </MenuItem>
                  </MenuList>
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
      <Drawer
        anchor="left"
        variant="persistent"
        open={showDrawer}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={setShowDrawer(false)}>
            <ChevronLeft />
          </IconButton>
        </div>
        <Divider />
        <List>
          <ListItem button onClick={() => setShowEditTagDialog(true)}>
            <ListItemIcon className={classes.listIcons}>
              <Edit />
            </ListItemIcon>
            <ListItemText primary="Edit tags" />
          </ListItem>
          <ListItem button onClick={toggleSorting}>
            <ListItemIcon className={classes.listIcons}>
              <Sort />
            </ListItemIcon>
            <ListItemText primary={sortButtonText} />
          </ListItem>
        </List>
        <Divider />
        <List>{renderTags()}</List>
      </Drawer>
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
        open={showCustomDialog}
        handleClose={() => {
          setShowCustomDialog(false);
        }}
        handleConfirm={handleLogoutClick}
        isDisabled={false}
      />
      <EditTagDialog
        open={showEditTagDialog}
        handleClose={() => {
          setShowEditTagDialog(false);
        }}
      />
    </Fragment>
  );
};

export default Header;
