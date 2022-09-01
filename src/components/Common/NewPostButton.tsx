import React from "react";
import { Link } from "react-router-dom";
import { Edit } from "@material-ui/icons";
import { Fab, Tooltip, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => ({
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  }
}));

const NewPostButton: React.FC = () => {
  const classes = useStyles();
  return (
    <Tooltip title="Write a story" aria-label="new post">
      <Fab
        color="secondary"
        aria-label="new post"
        className={classes.fab}
        component={Link}
        to="/posts/new"
      >
        <Edit />
      </Fab>
    </Tooltip>
  );
};

export default NewPostButton;
