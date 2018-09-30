import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";

import { withStyles } from "@material-ui/core";
import ErrorAlert from "../containers/ErrorAlert";
import Cards from "../components/cards";
import CardPlaceHolder from "../components/cardPlaceholder";

import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import Switch from "@material-ui/core/Switch";
import Edit from "@material-ui/icons/Edit";

import { fetchPosts } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

const styles = {
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  },
  switch:{
    width: "100%",
    marginTop: "-12px",
    marginBottom: "-12px",
    fontSize: '0.6em'
  }
};

class PostIndex extends Component {
  state={
    orderChecked: false
  }
  componentDidMount() {
    //Get posts on mount
    this.props.fetchPosts();
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };
  render() {
    const { error, isPending, posts, classes, isAuthenticated } = this.props;
    const {orderChecked} = this.state;
    return (
      <Fragment>
        <Grid container spacing={24}>

          {//Show Error when there is any
          error && error.status ? <ErrorAlert /> : null}

          {/* Sorting switch */}
          <div className={classes.switch}>
            <Switch
            checked={orderChecked}
            onChange={this.handleChange('orderChecked')}
            value="orderChecked"
          />
          Sorting by: {orderChecked? 'latest': 'oldest'} first
          </div>

          {//Show placeholders when loading
          isPending ? <CardPlaceHolder /> : <Cards posts={posts} latestFirst={orderChecked} />}

          {//Show Write-new FAB when user is authenticated
          isAuthenticated && (
            <Tooltip title="Write a story">
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
            </Tooltip>
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
