import React, { Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { gql, useQuery } from "@apollo/client";
import { Grid, Typography } from "@material-ui/core";
import { ErrorAlert, Cards, NewPostButton } from "@components";
import { tokenVar } from "../cache";
import checkIfExpired from "../middlewares/checkTokenExpired";

type TParams = { userId: string };
type Props = RouteComponentProps<TParams>;

const GET_USER_POSTS = gql`
  query getUserPosts($_id: String!) {
    getUserPosts(_id: $_id) {
      _id
      title
      authorInfo {
        _id
        username
      }
      content
      date
    }
  }
`;

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const UserProfile: React.FC<Props> = props => {
  const { loading, error, data } = useQuery(GET_USER_POSTS, {
    variables: {
      _id: props.match.params.userId
    }
  });

  const urlQuery = getUrlQuery(props.location.search);
  const isAuthenticated = !checkIfExpired(tokenVar());
  const username = urlQuery.get("username");

  if (loading || !data) {
    return null;
  }

  console.log(loading); // TODO

  const userPosts = data.getUserPosts;
  const postCount = userPosts.length;

  return (
    <Fragment>
      <Typography variant="h5" gutterBottom align="center">
        There are {postCount} post
        {postCount > 1 && "s"} by {username}
      </Typography>
      {error && <ErrorAlert />}
      <Grid container spacing={3}>
        <Fragment>
          <Cards posts={userPosts} />
          {isAuthenticated && <NewPostButton destination="/posts/new" />}
        </Fragment>
      </Grid>
    </Fragment>
  );
};

export default UserProfile;
