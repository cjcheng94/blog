import React, { useState, Fragment } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useQuery, useReactiveVar } from "@apollo/client";
import { useSnackbar } from "notistack";
import makeStyles from "@mui/styles/makeStyles";
import {
  Tooltip,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  LinearProgress,
  Menu,
  MenuList,
  MenuItem,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  useScrollTrigger
} from "@mui/material";
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
} from "@mui/icons-material";
import {
  darkModeVar,
  searchOverlayVar,
  drawerVar,
  loadingVar,
  sortLatestFirstVar,
  accountDialogTypeVar,
  isAuthedVar
} from "../api/cache";
import {
  CustomDialog,
  EditTagDialog,
  ErrorAlert,
  AutosaveSpinner
} from "@components";
import { removeAuth } from "@utils";
import { GET_ALL_TAGS } from "../api/gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.mode === "dark";
  const drawerWidth = 240;

  return {
    toolBar: {
      justifyContent: "space-between"
    },
    brand: {
      fontFamily: "Notable, sans-serif",
      fontSize: "3rem",
      textDecorationLine: "none",
      marginTop: "-11px",

      background: " linear-gradient(to right, #4ca1af, #c4e0e5)",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",

      backgroundClip: "text",
      "-webkit-background-clip": "text",
      color: "transparent"

      // textShadow:
      //   "0 1px 0 #ccc, 0 2px 0 #c9c9c9, 0 3px 0 #bbb,0 4px 0 #b9b9b9,0 5px 0 #aaa,0 6px 1px rgba(0,0,0,.1), 0 0 5px rgba(0,0,0,.1), 0 1px 3px rgba(0,0,0,.3), 0 3px 5px rgba(0,0,0,.2), 0 5px 10px rgba(0,0,0,.25), 0 10px 10px rgba(0,0,0,.2), 0 20px 20px rgba(0,0,0,.15)"
    },
    //A transparent place holder for progress bar,
    //avoids page jumping issues
    progressContainer: {
      height: 5,
      width: "100%",
      position: "fixed",
      top: 64,
      [theme.breakpoints.down("sm")]: {
        top: 56
      }
    },
    drawerPaper: {
      width: drawerWidth,
      [theme.breakpoints.down("sm")]: {
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
      backgroundColor: isDarkTheme
        ? "rgba(51,51,51,0.65)"
        : "rgba(255,255,255,0.65)",
      backdropFilter: "blur(12px)",
      boxShadow: "none",
      transition: theme.transitions.create(
        ["margin", "width", "transform", "boxShadow"],
        {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }
      )
    },
    appBarShift: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
      [theme.breakpoints.down("sm")]: {
        width: "initial",
        marginLeft: 0
      }
    },
    appBarSlideUp: {
      boxShadow: "none",
      transform: "translateY(-64px)",
      [theme.breakpoints.down("sm")]: {
        transform: "translateY(-56px)"
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
      [theme.breakpoints.down("sm")]: {
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
  removeAuth();
  callback();
};

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const Header = () => {
  const history = useHistory();
  const location = useLocation();

  const [showCustomDialog, setShowCustomDialog] = useState<boolean>(false);
  const [showEditTagDialog, setShowEditTagDialog] = useState<boolean>(false);
  const [anchorEl, setAnchorEl] = useState<Element | null>(null);

  const getInitialTagIds = () => {
    if (location.pathname === "/posts/tags") {
      const urlQuery = getUrlQuery(location.search);
      const tagIds = urlQuery.getAll("tagIds");
      return tagIds;
    }
    return [];
  };

  const [selectedTagIds, setSelectedTagIds] =
    useState<string[]>(getInitialTagIds);

  const classes = useStyles();
  const isLoading = useReactiveVar(loadingVar);
  const showDrawer = useReactiveVar(drawerVar);
  const sortLatestFirst = useReactiveVar(sortLatestFirstVar);
  const isAuthenticated = useReactiveVar(isAuthedVar);

  const { enqueueSnackbar } = useSnackbar();

  // Get all tags to render searched tags
  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: getTagsData
  } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

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
      enqueueSnackbar("Logout successful");
      setTimeout(() => {
        history.push("/");
      }, 1000);
    };

    userLogout(logoutCallback);
  };

  // Go to PostsByTags page and pass selected tagIds in query string
  const handleSearch = (selectedTagIds: string[]) => {
    const searchParams = new URLSearchParams();
    selectedTagIds.forEach(tagId => {
      searchParams.append("tagIds", tagId);
    });
    const queryString = searchParams.toString();
    const postsByTagsUrl = `/posts/tags?${queryString}`;
    history.push(postsByTagsUrl);
  };

  const handleTagSelect = (e: React.MouseEvent, tagId: string) => {
    const newSelectedTags = selectedTagIds.includes(tagId)
      ? selectedTagIds.filter(id => tagId !== id)
      : [...selectedTagIds, tagId];

    setSelectedTagIds(newSelectedTags);

    if (newSelectedTags.length > 0) {
      // There are selected tags, go to postsByTags page
      handleSearch(newSelectedTags);
    } else {
      // Un-selected all tags, go back to home page
      history.push("/");
    }
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

  const TagList = () => {
    if (getTagsLoading || !getTagsData?.tags) return null;
    return (
      <List>
        {getTagsData.tags.map(tag => (
          <ListItem
            button
            key={tag._id}
            title={tag.name}
            onClick={e => handleTagSelect(e, tag._id)}
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
        ))}
      </List>
    );
  };

  const logo = window.innerWidth < 400 ? "B!" : "BLOG!";
  const sortButtonText = sortLatestFirst ? "Latest first" : "Oldest first";

  // trigger is true when user scrolls down, false when user scrolls up
  const trigger = useScrollTrigger();

  const isPostNewRoute = location.pathname === "/posts/new";
  const isUpdateDraftRoute = location.pathname.startsWith("/drafts/edit");
  const isUpdatePostRoute = location.pathname.startsWith("/posts/edit");
  const showAutoSaveSpinner =
    isPostNewRoute || isUpdateDraftRoute || isUpdatePostRoute;

  const appBarClass = showDrawer
    ? `${classes.appBar} ${classes.appBarShift}`
    : trigger
    ? `${classes.appBar} ${classes.appBarSlideUp}`
    : classes.appBar;

  const menuButtonClass = showDrawer
    ? `${classes.menuButton} ${classes.hideXsUp}`
    : classes.menuButton;

  return (
    <Fragment>
      {getTagsError && <ErrorAlert error={getTagsError} />}
      <AppBar position="sticky" color="inherit" className={appBarClass}>
        <Toolbar className={classes.toolBar}>
          <div className={classes.centerAligned}>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={setShowDrawer(true)}
              edge="start"
              className={menuButtonClass}
              size="large"
            >
              <MenuIcon />
            </IconButton>
            <Typography
              color="inherit"
              variant="h4"
              className={classes.brand}
              component={Link}
              to="/"
            >
              {logo}
            </Typography>
          </div>
          {/* Show different sets of buttons based on whether user is signed in or not*/}
          <div id="conditional-buttons">
            {showAutoSaveSpinner && <AutosaveSpinner />}
            <Tooltip title="Search">
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={toggleSearchOverlay}
                size="large"
              >
                <Search />
              </IconButton>
            </Tooltip>
            <Tooltip title="Toggle darkmode">
              <IconButton
                aria-haspopup="true"
                color="inherit"
                onClick={toggleDarkMode}
                size="large"
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
                  size="large"
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
                    <MenuItem>
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
          <IconButton onClick={setShowDrawer(false)} size="large">
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
        <TagList />
      </Drawer>
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
