import React from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  url: {
    backgroundColor: "#DCDCDC",
    fontFamily: "monospace",
    overflowWrap: "break-word"
  }
});

const NoMatch = () => {
  const location = useLocation();
  const classes = useStyles();

  return (
    <div>
      <Typography variant="h5" color="error">
        Oops...
      </Typography>
      <p className={classes.url}>{location.pathname}</p>
      <Typography variant="body1" color="error">
        This page doesn&#39;t exist, please go back.
      </Typography>
    </div>
  );
};

export default NoMatch;
