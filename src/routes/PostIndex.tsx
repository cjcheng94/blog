import React, { Fragment, useEffect, useContext } from "react";
import { useQuery } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { GET_ALL_POSTS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { SortingContext } from "@context";

const PostIndex = () => {
  const { loading, error, data, fetchMore, refetch } = useQuery(GET_ALL_POSTS, {
    variables: {
      first: 10
    },
    notifyOnNetworkStatusChange: true
  });

  const { updateRefetchFn } = useContext(SortingContext);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  useEffect(() => {
    if (refetch) {
      updateRefetchFn(refetch);
    }
  }, [refetch, updateRefetchFn]);

  const renderCards = () => {
    if (!data?.posts) {
      return <CardPlaceholder />;
    }
    // TODO: when we implemente more GraphQL Connections on the backend,
    // let Card handle the data structure change
    const posts = data.posts.edges.map(edge => edge.node);

    const { endCursor, hasNextPage } = data.posts.pageInfo;

    return (
      <Cards
        posts={posts}
        hasNextPage={hasNextPage}
        fetchMore={() => {
          fetchMore({
            variables: {
              first: 10,
              after: endCursor
            }
          });
        }}
      />
    );
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
