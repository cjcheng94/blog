import React, { Fragment, useEffect } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import {
  useErrorAlert,
  Cards,
  CardPlaceholder,
  NewPostButton
} from "@components";
import { GET_USER_DRAFTS } from "../api/gqlDocuments";
import { loadingVar, accountDialogTypeVar, isAuthedVar } from "../api/cache";

const showAccountDialog = (type: "login" | "signup") => {
  accountDialogTypeVar(type);
};

const Drafts = () => {
  const isAuthenticated = useReactiveVar(isAuthedVar);
  const { showErrorAlert } = useErrorAlert();

  const { loading, error, data } = useQuery(GET_USER_DRAFTS, {
    skip: !isAuthenticated
  });

  useEffect(() => {
    if (!isAuthenticated) {
      //Prompt user to log in
      showAccountDialog("login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  useEffect(() => {
    showErrorAlert(error);
  }, [error, showErrorAlert]);

  const renderCards = () => {
    if (loading || !data?.getUserDrafts) {
      return <CardPlaceholder />;
    }
    return <Cards type="draft" drafts={data.getUserDrafts} />;
  };

  return (
    <Fragment>
      {renderCards()}
      <NewPostButton />
    </Fragment>
  );
};

export default Drafts;
