import React, { useEffect, Fragment } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Typography } from "@material-ui/core";
import { ErrorAlert, Cards, NewPostButton } from "@components";
import { GET_USER_POSTS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { useGetUrlParams } from "@utils";

const UserProfile = () => {
  const location = useLocation();
  const match = useRouteMatch<{ userId: string }>();

  const { loading, error, data } = useQuery(GET_USER_POSTS, {
    variables: {
      _id: match.params.userId
    }
  });

  const { username } = useGetUrlParams(location.search);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

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
      <NewPostButton />
    </Fragment>
  );
};

export default UserProfile;
