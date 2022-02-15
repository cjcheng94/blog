import React, { useState, useEffect } from "react";
import { CloudDone, Sync, SyncProblem } from "@material-ui/icons";
import { IconButton, Tooltip, makeStyles } from "@material-ui/core";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { GET_DRAFT_UPDATING, GET_DRAFT_ERROR } from "../../api/gqlDocuments";

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

  // Get pending and error state
  const { data: getDraftUpdatingData } = useQuery(GET_DRAFT_UPDATING);
  const { data: getDraftErrorData } = useQuery(GET_DRAFT_ERROR);

  const { draftUpdating } = getDraftUpdatingData;
  const { draftError } = getDraftErrorData;

  useEffect(() => {
    // Draft routes
    const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);
    const urlQuery = getUrlQuery(location.search);
    const isDraft = urlQuery.has("isDraft");

    const isPostNewRoute = location.pathname === "/posts/new";
    const isUpdateDraftRoute =
      location.pathname.startsWith("/posts/edit") && isDraft;

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
