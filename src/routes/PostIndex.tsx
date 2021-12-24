import React, { Fragment, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { GET_ALL_POSTS } from "../gqlDocuments";
import { loadingVar } from "../cache";

const PostIndex = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const renderCards = () => {
    if (loading || !data?.posts) {
      return <CardPlaceholder />;
    }
    return <Cards posts={data.posts} />;
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      {renderCards()}
      <NewPostButton />
    </Fragment>
  );
};

export default PostIndex;
