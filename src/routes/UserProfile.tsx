import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { ErrorAlert, Cards, NewPostButton } from "@components";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { GET_USER_POSTS } from "../gqlDocuments";
import { loadingVar } from "../cache";

type TParams = { userId: string };
type Props = RouteComponentProps<TParams>;

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const UserProfile: React.FC<Props> = props => {
  const { loading, error, data } = useQuery(GET_USER_POSTS, {
    variables: {
      _id: props.match.params.userId
    }
  });

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const urlQuery = getUrlQuery(props.location.search);
  const isAuthenticated = !checkIfExpired();
  const username = urlQuery.get("username");

  if (loading || !data) {
    return null;
  }

  const userPosts = data.getUserPosts;
  const postCount = userPosts.length;

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Typography variant="h5" gutterBottom align="center">
        There are {postCount} post
        {postCount > 1 && "s"} by {username}
      </Typography>
      <Cards posts={userPosts} />
      {isAuthenticated && <NewPostButton destination="/posts/new" />}
    </Fragment>
  );
};

export default UserProfile;
