import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";

class PostIndex extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  }
  componentWillUnmount() {
    this.props.clearLoader();
  }

  render() {
    const { error } = this.props;
    return (
      <div className="row">
        {error && error.status ? <ErrorPage /> : null}
        <Cards posts={this.props.posts} />
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
