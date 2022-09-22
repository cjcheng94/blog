import React, { useState, useEffect } from "react";
import { CloudDone, Sync, SyncProblem } from "@material-ui/icons";
import { IconButton, Tooltip } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { RouteComponentProps, withRouter } from "react-router-dom";
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

const AutosaveSpinner: React.FC<RouteComponentProps> = ({ location }) => {
  const [showAutosaveSpinner, setShowAutosaveSpinner] =
    useState<boolean>(false);

  const classes = useStyles();

  const draftUpdating = useReactiveVar(draftUpdatingVar);
  const draftError = useReactiveVar(draftErrorVar);

  useEffect(() => {
    const isPostNewRoute = location.pathname === "/posts/new";
    const isUpdateDraftRoute = location.pathname.startsWith("/drafts/edit");

    // Show autosave spinner conditionally
    if (isPostNewRoute || isUpdateDraftRoute) {
      setShowAutosaveSpinner(true);
    } else {
      setShowAutosaveSpinner(false);
    }
  }, [location.pathname]);

  const renderIcon = () => {
    if (draftUpdating) {
      return (
        <Tooltip title="saving to draft">
          <Sync />
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

  return showAutosaveSpinner ? (
    <IconButton
      disableRipple
      disableFocusRipple
      aria-haspopup="true"
      color="inherit"
      classes={{
        root: classes.root,
        label: draftUpdating ? classes.spinner : ""
      }}
    >
      {renderIcon()}
    </IconButton>
  ) : null;
};

export default withRouter(AutosaveSpinner);
