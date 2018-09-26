import React, { Fragment } from "react";

import { withStyles } from "@material-ui/core";
import Typography from "@material-ui/core/Typography";

import Header from "../containers/Header";

const styles = {
  nmAppbar: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0
  },
  nmcontent: {
    marginTop: 64
  },
  url: {
    backgroundColor: "#DCDCDC"
  }
};
const NoMatch = props => {
  const { location, classes } = props;
  return (
    <Fragment>
      <div className={classes.nmAppbar}>
        <Header />
      </div>
      <div className={classes.nmcontent}>
        <Typography variant="headline" color="error">
          Oops...
        </Typography>
        <pre>
          <code className={classes.url}>{location.pathname}</code>
        </pre>
        <Typography variant="body2" color="error">
          This page doesn't exist, please go back.
        </Typography>
      </div>
    </Fragment>
  );
};
export default withStyles(styles)(NoMatch);
