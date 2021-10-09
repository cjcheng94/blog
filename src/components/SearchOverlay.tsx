import React, { useState } from "react";
import { Paper, TextField, Chip, makeStyles } from "@material-ui/core";
import { Search } from "@material-ui/icons";

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
    flexWrap: "wrap"
  },
  chip: {
    margin: theme.spacing(0.5)
  }
}));

const SearchOverlay: React.FC<Props> = ({ open }) => {
  const [chipList, setChipList] = useState<string[]>([]);
  const classes = useStyles();

  console.log(chipList);

  const isChipSelected = (type: string) => chipList.includes(type);

  // Add or remove clicked chip type from state
  const handleChipClick = (type: string) => () => {
    setChipList(prevList => {
      if (prevList.includes(type)) {
        return prevList.filter(chipType => chipType !== type);
      }
      return [...prevList, type];
    });
  };

  if (!open) {
    return null;
  }

  return (
    <div className={classes.wrapper}>
      <div className={classes.toolbarSpacer}></div>
      <div className={classes.content}>
        <Paper className={classes.paper} elevation={3}>
          <div className={classes.inputContainer}>
            <div className={classes.iconContainer}>
              <Search />
            </div>
            <TextField className={classes.input} label="Search" />
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
        </Paper>
      </div>
    </div>
  );
};

export default SearchOverlay;
