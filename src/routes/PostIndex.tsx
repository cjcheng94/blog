import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useCallback
} from "react";
import { useQuery, useReactiveVar, NetworkStatus } from "@apollo/client";
import {
  ErrorAlert,
  CardPlaceholder,
  NewPostButton,
  ArticleCard
} from "@components";
import { loadingVar, sortLatestFirstVar } from "../api/cache";
import { GET_ALL_POSTS } from "../api/gqlDocuments";
import { GetAllPostsQuery, Post } from "@graphql";
import { useHistory } from "react-router-dom";
import { SortingContext } from "@context";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    display: "grid",
    gap: 24,
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
    }
  },
  bottomText: {
    marginTop: 16,
    textAlign: "center",
    fontSize: "1.4em",
    color: theme.palette.text.secondary
  }
}));

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
  const { updateRefetchFn } = useContext(SortingContext);

  const sortLatest = useReactiveVar(sortLatestFirstVar);
  const history = useHistory();
  const classes = useStyles();

  const observer = useRef<IntersectionObserver | null>(null);

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

  const { startCursor, endCursor, hasPreviousPage, hasNextPage } =
    data?.posts.pageInfo || {};

  const noPosts = !data?.posts || sortedPosts.length < 1;

  const canFetchMore =
    (sortLatest && hasNextPage) || (!sortLatest && hasPreviousPage);

  const fetchMorePosts = useCallback(() => {
    const cursor = sortLatest ? endCursor : startCursor;

    fetchMore<GetAllPostsQuery, ReturnType<typeof queryVariables>>({
      variables: queryVariables(sortLatest, 10, cursor)
    });
  }, [endCursor, fetchMore, sortLatest, startCursor]);

  // A ref callback for the last card, we initiate an intersection observer here
  // and start observing the last card and fetch more posts whenever appropriate
  const lastPostCardRef = useCallback(
    node => {
      console.log(node);

      // Prevents redundant api calls when we're already fetching
      if (isFetchingMore) return;

      // Stop observing the last "last card"
      if (observer.current) {
        observer.current.disconnect();
      }

      // We initialize an intersection observer here,
      // fetch the next set of posts when the last card is visible in the viewport,
      // i.e. we're at the bottom of our page.
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && canFetchMore) {
          fetchMorePosts();
        }
      });

      // Start observing the last card when this ref callback is passed to the last card
      if (node) {
        observer.current.observe(node);
      }
    },
    [canFetchMore, fetchMorePosts, isFetchingMore]
  );

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

  const bottomText = () => {
    if (isFetchingMore) {
      return "Fetching more posts";
    }

    if (canFetchMore) {
      return "Scroll for more";
    }

    return "Showing all posts";
  };

  const cards = sortedPosts.map((post, index) => {
    const { _id, title, contentText, tags } = post;

    const url = `/posts/detail/${_id}`;
    const isLastCard = index === sortedPosts.length - 1;

    // Give the ref callback to the last card on the page
    // so we can fetch more posts whenever the user scrolls to this card
    return (
      <ArticleCard
        _id={_id}
        key={_id}
        title={title}
        contentText={contentText}
        tags={tags}
        authorInfo={post?.authorInfo}
        thumbnailUrl={post?.thumbnailUrl}
        onClick={() => {
          history.push(url);
        }}
        ref={isLastCard ? lastPostCardRef : undefined}
      />
    );
  });

  return (
    <>
      {error && <ErrorAlert error={error} />}
      <NewPostButton />
      {noPosts ? (
        <CardPlaceholder />
      ) : (
        <div className={classes.cardsContainer}>{cards}</div>
      )}
      {sortedPosts.length > 0 && (
        <div className={classes.bottomText}>{bottomText()}</div>
      )}
    </>
  );
};

export default PostIndex;
