import React from "react";
import { Paper, makeStyles } from "@material-ui/core";

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
  paper: {}
}));

const SearchOverlay: React.FC<Props> = ({ open }) => {
  const classes = useStyles();

  if (!open) {
    return null;
  }
  return (
    <div className={classes.wrapper}>
      <div className={classes.toolbarSpacer}></div>
      <div className={classes.content}>
        <Paper className={classes.paper} elevation={3}>
          <div>By the pricking of my thumbs</div>
          <div>Something wicked this way comes</div>
        </Paper>
      </div>
    </div>
  );
};

export default SearchOverlay;
