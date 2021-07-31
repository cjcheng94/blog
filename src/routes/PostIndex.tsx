import React, { Fragment, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import { makeStyles, Grid, Tooltip, Switch } from "@material-ui/core";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";

const useStyles = makeStyles(theme => ({
  switch: {
    width: "100%",
    marginTop: "-12px",
    marginBottom: "-12px",
    fontSize: "0.6em"
  }
}));

const GET_ALLPOSTS = gql`
  query getAllPosts {
    posts {
      _id
      title
      author
      content
      date
    }
  }
`;

const PostIndex = () => {
  const isAuthenticated = false; // TODO
  const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";

  const [orderChecked, setOrderChecked] = useState(false);
  const { loading, error, data } = useQuery(GET_ALLPOSTS);
  const classes = useStyles();

  return (
    <Fragment>
      <Grid container spacing={3}>
        {error && <ErrorAlert />}
        {/* Sorting switch */}
        <div className={classes.switch}>
          <Switch
            checked={orderChecked}
            onChange={e => {
              setOrderChecked(e.target.checked);
            }}
            value="orderChecked"
          />
          Sorting by:{" "}
          <strong>{orderChecked ? "latest" : "oldest"} first</strong>
        </div>

        {
          //Show placeholders when loading
          loading ? (
            <CardPlaceholder />
          ) : (
            <Cards posts={data.posts} latestFirst={orderChecked} />
          )
        }

        {/* Direct user to sign up page or if already signed in, write new page */}
        <Tooltip title="Write a story">
          <NewPostButton destination={writeButtonPath} />
        </Tooltip>
      </Grid>
    </Fragment>
  );
};

export default PostIndex;
