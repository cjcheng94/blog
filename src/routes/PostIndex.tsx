import React, { Fragment, useEffect, useContext } from "react";
import { useQuery, useReactiveVar } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { Button } from "@mui/material";
import { GET_ALL_POSTS } from "../api/gqlDocuments";
import { SortingContext } from "@context";
import { loadingVar, sortLatestFirstVar } from "../api/cache";
import { GetAllPostsQuery } from "@graphql";

const queryVariables = (
  latestFirst: boolean = true,
  count?: number,
  cursor?: string
) =>
  latestFirst
    ? {
        first: count,
        after: cursor
      }
    : {
        last: count,
        before: cursor
      };

const PostIndex = () => {
  const sortLatest = useReactiveVar(sortLatestFirstVar);

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

    const posts = data?.posts.edges.map(edge => edge.node);

    const { startCursor, endCursor, hasPreviousPage, hasNextPage } =
      data?.posts.pageInfo;

    const sortedPosts = sortLatest
      ? posts
      : posts.sort((a, b) => Date.parse(a.date) - Date.parse(b.date));

    const canFetchMore =
      (sortLatest && hasNextPage) || (!sortLatest && hasPreviousPage);

    const fetchMorePosts = () => {
      const cursor = sortLatest ? endCursor : startCursor;
      fetchMore<GetAllPostsQuery, ReturnType<typeof queryVariables>>({
        variables: queryVariables(sortLatest, 10, cursor)
      });
    };

    return (
      <>
        <Cards posts={sortedPosts} />
        {canFetchMore && <Button onClick={fetchMorePosts}>Fetch More</Button>}
      </>
    );
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <NewPostButton />
      {renderCards()}
    </Fragment>
  );
};

export default PostIndex;
