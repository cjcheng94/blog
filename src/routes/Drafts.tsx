import React, { Fragment, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { GET_USER_DRAFTS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { Draft } from "PostTypes";

const Drafts = () => {
  const { loading, error, data } =
    useQuery<{ getUserDrafts: Draft[] }>(GET_USER_DRAFTS);

  // TODO: Prompt user to log in

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
