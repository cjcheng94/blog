import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Edit from "@material-ui/icons/Edit";

import ErrorAlert from "../containers/ErrorAlert";
import Cards from "../components/Cards";
import { fetchPosts } from "../actions/posts";

const styles = {
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  }
};

class UserProfile extends Component {
  componentDidMount() {
    //if this.props.posts is already there, don't waste network usage on fetching again
    if (Object.keys(this.props.posts).length === 0) {
      this.props.fetchPosts();
    }
  }
  render() {
    const { error, posts, userFilter, isAuthenticated, classes } = this.props;

    //filter all posts whose author prop matches the username in url
    const userPosts = {};
    for (let key in posts) {
      if (posts[key]["author"] === userFilter) {
        userPosts[key] = posts[key];
      }
    }
    const postCount = Object.keys(userPosts).length;

    return (
      <Fragment>
        <Typography variant="h5" gutterBottom align="center">
          There are {postCount} post
          {postCount > 1 && "s"} by {userFilter}
        </Typography>
        {error && error.status ? <ErrorAlert /> : null}
        <Grid container spacing={24}>
          <Fragment>
            <Cards posts={userPosts} />
            {isAuthenticated && (
              <Button
                variant="fab"
                color="secondary"
                aria-label="Edit"
                className={classes.fab}
                component={Link}
                to="/posts/new"
              >
                <Edit />
              </Button>
            )}
          </Fragment>
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {
    posts: state.posts,
    isPending: state.isPending,
    error: state.error,
    isAuthenticated: state.user.isAuthenticated,
    userFilter: decodeURIComponent(ownProps.match.params.username)
  };
};

export default compose(
  withStyles(styles, {
    name: "UserProfile"
  }),
  connect(
    mapStateToProps,
    { fetchPosts }
  )
)(UserProfile);
