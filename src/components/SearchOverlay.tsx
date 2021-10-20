import React, { useState } from "react";
import {
  Paper,
  TextField,
  Chip,
  ClickAwayListener,
  IconButton,
  Button,
  makeStyles,
  LinearProgress
} from "@material-ui/core";
import { Search, Close } from "@material-ui/icons";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { searchOverlayVar } from "../cache";
import { GET_ALL_TAGS } from "../gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => ({
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: "100%",
    height: "100vh",
    zIndex: 2,
    display: "flex",
    flexDirection: "column"
  },
  toolbarSpacer: theme.mixins.toolbar,
  content: {
    width: "100%",
    height: "100%",
    padding: 24,
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

type Props = {} & RouteComponentProps;

const SearchOverlay: React.FC<Props> = ({ history }) => {
  const [tagList, setTagList] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { data } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);
  const classes = useStyles();

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

  return (
    <div className={classes.wrapper}>
      <div className={classes.toolbarSpacer}></div>
      <div className={classes.content}>
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
