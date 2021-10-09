import React, { useState } from "react";
import {
  Paper,
  TextField,
  Chip,
  ClickAwayListener,
  IconButton,
  Button,
  makeStyles
} from "@material-ui/core";
import { Search, Close } from "@material-ui/icons";
import { searchOverlayVar } from "../cache";

type Props = {
  open: boolean;
};

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
  }
}));

const hideSelf = () => {
  searchOverlayVar(false);
};

const SearchOverlay: React.FC<Props> = ({ open }) => {
  const [chipList, setChipList] = useState<string[]>([]);
  const [searchWord, setSearchWord] = useState<string>("");
  const classes = useStyles();

  const isChipSelected = (type: string) => chipList.includes(type);

  const handleSearchWordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchWord(e.target.value);
  };

  // Add or remove clicked chip type from state
  const handleChipClick = (type: string) => () => {
    setChipList(prevList => {
      if (prevList.includes(type)) {
        return prevList.filter(chipType => chipType !== type);
      }
      return [...prevList, type];
    });
  };

  const handleSearch = () => {
    console.log({ chipList, searchWord });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!open) {
    return null;
  }

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
                className={classes.input}
                label="Search"
                value={searchWord}
                onChange={handleSearchWordChange}
                onKeyDown={handleKeyDown}
              />
            </div>

            <div className={classes.chipContainer}>
              {[
                "Archive",
                "Translations",
                "Tutorials",
                "Miscellaneous",
                "Notes",
                "Other"
              ].map(type => (
                <Chip
                  clickable
                  key={type}
                  label={type}
                  variant={isChipSelected(type) ? "default" : "outlined"}
                  color={isChipSelected(type) ? "primary" : "default"}
                  onClick={handleChipClick(type)}
                  className={classes.chip}
                />
              ))}
            </div>
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

export default SearchOverlay;
