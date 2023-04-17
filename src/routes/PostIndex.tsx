import React, { useState, Fragment, useEffect, useContext } from "react";
import { useQuery, useReactiveVar, NetworkStatus } from "@apollo/client";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import { loadingVar, sortLatestFirstVar } from "../api/cache";
import { GET_ALL_POSTS } from "../api/gqlDocuments";
import { GetAllPostsQuery, Post } from "@graphql";
import { SortingContext } from "@context";
import { Button } from "@mui/material";

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

type GetAllPostReturnType = Pick<
  Post,
  | "_id"
  | "authorInfo"
  | "contentText"
  | "date"
  | "tagIds"
  | "tags"
  | "thumbnailUrl"
  | "title"
>;

const PostIndex = () => {
  const [sortedPosts, setSortedPosts] = useState<GetAllPostReturnType[]>([]);

  const sortLatest = useReactiveVar(sortLatestFirstVar);

  const { updateRefetchFn } = useContext(SortingContext);

  const { loading, error, data, fetchMore, refetch, networkStatus } = useQuery(
    GET_ALL_POSTS,
    {
      variables: {
        first: 10
      },
      notifyOnNetworkStatusChange: true
    }
  );

  // For some weired reason, Apollo prioritizes "setVariables" network status over
  // refetch status.
  const isRefetching = networkStatus === NetworkStatus.setVariables;

  const isFetchingMore = networkStatus === NetworkStatus.fetchMore;
  console.log(isFetchingMore);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  useEffect(() => {
    if (refetch) {
      updateRefetchFn(refetch);
    }
  }, [refetch, updateRefetchFn]);

  // We need to sort chunks of posts by date if the user uses backward pagination,
  // this is because GraphQL Connections dictates that data returned via backwards pagination
  // must be the same order as data returned via forward pagination.
  useEffect(() => {
    //We want to reset sorted posts array only when refetching
    if (isRefetching) {
      // Reset displayed posts when user toggles sorting switch,
      // this prevents stale posts being sorted immediately after the swich is toggled
      // which is very jarring. If not for this quirk, we can just sort posts in render
      setSortedPosts([]);
    }

    if (!data || loading) {
      return;
    }

    const posts = data.posts.edges.map(edge => edge.node);

    if (sortLatest) {
      setSortedPosts(posts);
      return;
    }
    // Only sort data if it's backward paginated
    setSortedPosts(
      [...posts].sort((a, b) => Date.parse(a.date) - Date.parse(b.date))
    );
  }, [data, isRefetching, loading, sortLatest]);

  const renderCards = () => {
    if (!data?.posts || sortedPosts.length < 1) {
      return <CardPlaceholder />;
    }

    const { startCursor, endCursor, hasPreviousPage, hasNextPage } =
      data?.posts.pageInfo;

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
        {canFetchMore && (
          <Button
            variant="contained"
            disabled={isFetchingMore}
            onClick={fetchMorePosts}>
            More posts
          </Button>
        )}
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
