import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import ErrorAlert from "../components/errorAlert";
import Cards from "../components/cards";
import CardPlaceHolder from "../components/cardPlaceholder";

import { fetchPosts } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

import { withStyles } from "@material-ui/core";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";

const styles = {
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  }
};

class PostIndex extends Component {
  componentDidMount() {
    //Get posts on mount
    this.props.fetchPosts();
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }

  render() {
    const { error, isPending, posts, classes, isAuthenticated } = this.props;
    return (
      <Fragment>
        <Grid container spacing={24}>
          {//Show Error when there is any
          error && error.status ? <ErrorAlert /> : null}
          {//Show placeholders when loading
          isPending ? <CardPlaceHolder /> : <Cards posts={posts} />}
          {//Show Write new FAB when user is authenticated
          isAuthenticated && (
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
        </Grid>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  posts: state.posts,
  isPending: state.isPending,
  error: state.error,
  isAuthenticated: state.user.isAuthenticated
});

export default compose(
  withStyles(styles, {
    name: "PostIndex"
  }),
  connect(
    mapStateToProps,
    { fetchPosts, clearLoader }
  )
)(PostIndex);
