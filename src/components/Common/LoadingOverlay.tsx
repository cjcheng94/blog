import React from "react";
import { CircularProgress } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  container: {
    position: "fixed",
    width: "100%",
    height: "100%",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.1)",
    zIndex: 2,
    backdropFilter: "blur(1.5px)" // Uber-cool blur effect
  },
  circularProfress: {
    position: "absolute",
    top: "calc(50% - 40px)",
    left: "calc(50% - 40px)"
  }
}));

const LoadingOverlay: React.FC = props => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <CircularProgress
        className={classes.circularProfress}
        color="primary"
        size={80}
      />
    </div>
  );
};

export default LoadingOverlay;
