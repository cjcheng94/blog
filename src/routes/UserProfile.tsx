import React, { useEffect, Fragment } from "react";
import { useLocation, useRouteMatch } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";
import { ErrorAlert, Cards, NewPostButton, CardPlaceholder } from "@components";
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

  const userPosts = data?.getUserPosts || [];
  const postCount = userPosts.length;

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Typography variant="h5" gutterBottom align="center">
        There are {postCount} post
        {postCount > 1 && "s"} by {username}
      </Typography>
      {loading ? <CardPlaceholder /> : <Cards posts={userPosts} />}
      <NewPostButton />
    </Fragment>
  );
};

export default UserProfile;
