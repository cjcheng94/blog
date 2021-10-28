import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton } from "@components";
import { GET_POSTS_BY_TAGS } from "../gqlDocuments";
import { loadingVar } from "../cache";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { PostsList } from "PostTypes";

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const PostsByTags: React.FC<RouteComponentProps> = props => {
  const urlQuery = getUrlQuery(props.location.search);
  const tagIds = urlQuery.getAll("tagIds");
  const isAuthenticated = !checkIfExpired();

  // Get posts by tags
  const { loading, error, data } = useQuery<{ getPostsByTags: PostsList }>(
    GET_POSTS_BY_TAGS,
    {
      variables: { tagIds }
    }
  );

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const getResults = () => {
    if (data?.getPostsByTags) {
      return data.getPostsByTags;
    }
    return [];
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Cards posts={getResults()} />
      {isAuthenticated && <NewPostButton destination="/posts/new" />}
    </Fragment>
  );
};

export default PostsByTags;
