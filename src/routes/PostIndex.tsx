import React, { Fragment, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { GET_ALL_POSTS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";

const PostIndex = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const renderCards = () => {
    if (loading || !data?.posts) {
      return <CardPlaceholder />;
    }
    // TODO: when we implemente more GraphQL Connections on the backend,
    // let Card handle the data structure change
    const posts = data.posts.edges.map(edge => edge.node);

    return <Cards posts={posts} />;
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
