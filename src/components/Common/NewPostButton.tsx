import React from "react";
import { Link } from "react-router-dom";
import { Edit } from "@mui/icons-material";
import { Fab, Tooltip, Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

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
        component={Link}
        to="/posts/new"
        classes={{
          root: classes.fab
        }}
      >
        <Edit />
      </Fab>
    </Tooltip>
  );
};

export default NewPostButton;
