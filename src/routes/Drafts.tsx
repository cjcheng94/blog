import React, { Fragment, useEffect } from "react";
import { useLazyQuery, useReactiveVar } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { GET_USER_DRAFTS } from "../api/gqlDocuments";
import { loadingVar, accountDialogTypeVar, isAuthedVar } from "../api/cache";
import { Draft } from "PostTypes";

const showAccountDialog = (type: "login" | "signup") => {
  accountDialogTypeVar(type);
};

const Drafts = () => {
  const [getUserDrafts, { loading, error, data }] = useLazyQuery<{
    getUserDrafts: Draft[];
  }>(GET_USER_DRAFTS);

  const isAuthenticated = useReactiveVar(isAuthedVar);

  useEffect(() => {
    if (!isAuthenticated) {
      //Prompt user to log in
      showAccountDialog("login");
      return;
    }
    // If user has already logged in, get drafts
    getUserDrafts();
  }, [getUserDrafts, isAuthenticated]);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const renderCards = () => {
    if (loading || !data?.getUserDrafts) {
      return <CardPlaceholder />;
    }
    return <Cards type="draft" drafts={data.getUserDrafts} />;
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      {renderCards()}
      <NewPostButton />
    </Fragment>
  );
};

export default Drafts;
