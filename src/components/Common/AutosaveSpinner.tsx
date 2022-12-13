import React from "react";
import { CloudDone, Sync, SyncProblem } from "@mui/icons-material";
import { IconButton, Tooltip } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import { useReactiveVar } from "@apollo/client";
import { draftUpdatingVar, draftErrorVar } from "../../api/cache";

const useStyles = makeStyles(() => ({
  "@keyframes spin": {
    "0%": { "transform-origin": "50% 50%" },
    "100%": { transform: "rotate(-360deg)" }
  },
  root: {
    cursor: "default",
    "&:hover": {
      backgroundColor: "unset"
    }
  },
  spinner: {
    animation: "$spin 1.4s linear infinite"
  }
}));

const AutosaveSpinner = () => {
  const classes = useStyles();

  const draftUpdating = useReactiveVar(draftUpdatingVar);
  const draftError = useReactiveVar(draftErrorVar);

  const renderIcon = () => {
    if (draftUpdating) {
      return (
        <Tooltip title="saving to draft">
          <Sync classes={{ root: classes.spinner }} />
        </Tooltip>
      );
    }
    if (draftError) {
      return (
        <Tooltip title="Error while saving draft">
          <SyncProblem />
        </Tooltip>
      );
    }
    return (
      <Tooltip title="Saved to draft">
        <CloudDone />
      </Tooltip>
    );
  };

  return (
    <IconButton
      disableRipple
      disableFocusRipple
      aria-haspopup="true"
      color="inherit"
      classes={{
        root: classes.root
      }}
      size="large"
    >
      {renderIcon()}
    </IconButton>
  );
};

export default AutosaveSpinner;
