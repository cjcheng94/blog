import React, { Component } from "react";
import { connect } from "react-redux";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";
import CardPlaceHolder from "../components/cardPlaceholder";

import { fetchPosts } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

class PostIndex extends Component {
  componentDidMount() {
    //We always want to fetch all posts in index page
    //because this way we can capture changes in post(s)
    this.props.fetchPosts();
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }

  render() {
    const { error, isPending, posts } = this.props;
    return (
      <div className="row">
        {error && error.status ? <ErrorPage /> : null}
        {
          //Show placeholders when loading
          isPending ? <CardPlaceHolder /> : <Cards posts={posts} />}
      </div>
    );
  }
}

function mapStateToProps({ posts, error, isPending }) {
  return {
    posts,
    isPending,
    error
  };
}

export default connect(
  mapStateToProps,
  { fetchPosts, clearLoader }
)(PostIndex);
