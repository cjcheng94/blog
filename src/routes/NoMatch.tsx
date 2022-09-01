import React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  url: {
    backgroundColor: "#DCDCDC",
    fontFamily: "monospace",
    overflowWrap: "break-word"
  }
});

type Props = RouteComponentProps<{}>;

const NoMatch: React.FC<Props> = props => {
  const { location } = props;
  const classes = useStyles();
  return (
    <div>
      <Typography variant="h5" color="error">
        Oops...
      </Typography>
      <p className={classes.url}>{location.pathname}</p>
      <Typography variant="body1" color="error">
        This page doesn't exist, please go back.
      </Typography>
    </div>
  );
};

export default NoMatch;
