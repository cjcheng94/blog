import React, { useState, useEffect } from "react";
import {
  Paper,
  TextField,
  Chip,
  ClickAwayListener,
  IconButton,
  Button,
  LinearProgress
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { Search, Close } from "@material-ui/icons";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useQuery, useReactiveVar } from "@apollo/client";
import { searchOverlayVar, drawerVar } from "../api/cache";
import { GET_ALL_TAGS } from "../api/gqlDocuments";
import { Tag } from "PostTypes";

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    height: "100vh",
    zIndex: 2,
    display: "flex",
    flexDirection: "column",
    marginLeft: 0,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  wrapperShift: {
    marginLeft: drawerWidth,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    [theme.breakpoints.down("xs")]: {
      marginLeft: 0
    }
  },
  toolbarSpacer: theme.mixins.toolbar,
  content: {
    width: "100%",
    height: "100%",
    padding: 24,
    // transition props
    backgroundColor: "rgba(0,0,0,0)",
    backdropFilter: "blur(0)",
    transition: " all 125ms cubic-bezier(0.4, 0, 0.2, 1)"
  },
  openedContent: {
    backgroundColor: "rgba(0,0,0,0.4)",
    backdropFilter: "blur(1.5px)" // Uber-cool blur effect
  },
  paper: {
    position: "relative",
    padding: 32,
    width: "80%",
    margin: "auto",
    [theme.breakpoints.down("sm")]: {
      width: "100%"
    },
    [theme.breakpoints.down("xs")]: {
      padding: 24
    }
  },
  inputContainer: {
    display: "flex",
    alignItems: "flex-end",
    marginBottom: 24
  },
  iconContainer: {
    padding: 4,
    marginBottom: -6
  },
  input: {
    width: "100%"
  },
  chipContainer: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    marginBottom: 24
  },
  chip: {
    margin: theme.spacing(0.5)
  },
  closeButton: {
    position: "absolute",
    top: 4,
    right: 4
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "flex-end"
  },
  progress: {
    width: "100%",
    marginTop: 4,
    marginBottom: 4
  }
}));

const hideSelf = () => {
  searchOverlayVar(false);
};

const SearchOverlay: React.FC<RouteComponentProps> = ({ history }) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [mounted, setMounted] = useState<boolean>(false);

  const showDrawer = useReactiveVar(drawerVar);
  const classes = useStyles();
  const { data } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isTagSelected = (type: string) => tagList.includes(type);

  const handleSearchTermChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  // Add or remove clicked tag type from state
  const handleTagClick = (tagId: string) => () => {
    setTagList(prevList => {
      if (prevList.includes(tagId)) {
        return prevList.filter(id => id !== tagId);
      }
      return [...prevList, tagId];
    });
  };

  const handleSearch = () => {
    if (!searchTerm && !tagList.length) {
      return;
    }
    // Construct search params
    const searchParams = new URLSearchParams({ searchTerm });
    tagList.forEach(tagId => {
      searchParams.append("tagIds", tagId);
    });
    const queryString = searchParams.toString();
    // Pass search term in URL
    const userPostUrl = `/results?${queryString}`;
    // Go to result page where we execute the query
    history.push(userPostUrl);
    setTimeout(() => {
      hideSelf();
    }, 300);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  // Render searched tags
  const renderTags = () => {
    if (!data || !data.tags) {
      return <LinearProgress className={classes.progress} />;
    }
    return data.tags.map(
      tag =>
        tag && (
          <Chip
            clickable
            size="small"
            key={tag._id}
            label={tag.name}
            variant={isTagSelected(tag._id) ? "default" : "outlined"}
            color={isTagSelected(tag._id) ? "primary" : "default"}
            onClick={handleTagClick(tag._id)}
            className={classes.chip}
          />
        )
    );
  };

  // Css transition animation on mount
  const contentClass = mounted
    ? `${classes.content} ${classes.openedContent}`
    : classes.content;

  const wrapperClass = showDrawer
    ? `${classes.wrapper} ${classes.wrapperShift}`
    : classes.wrapper;

  return (
    <div className={wrapperClass}>
      <div className={classes.toolbarSpacer}></div>
      <div className={contentClass}>
        <ClickAwayListener onClickAway={hideSelf}>
          <Paper className={classes.paper} elevation={3}>
            <IconButton
              aria-label="close"
              color="inherit"
              onClick={hideSelf}
              className={classes.closeButton}
            >
              <Close />
            </IconButton>

            <div className={classes.inputContainer}>
              <div className={classes.iconContainer}>
                <Search />
              </div>
              <TextField
                autoFocus
                className={classes.input}
                label="Search"
                value={searchTerm}
                onChange={handleSearchTermChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={classes.chipContainer}>{renderTags()}</div>
            <div className={classes.buttonContainer}>
              <Button color="secondary" onClick={handleSearch}>
                Search
              </Button>
            </div>
          </Paper>
        </ClickAwayListener>
      </div>
    </div>
  );
};

export default withRouter(SearchOverlay);
