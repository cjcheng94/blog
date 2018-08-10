import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/posts";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";

class PostIndex extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  }
  render() {
    if (this.props.error && this.props.error.status) {
      return <ErrorPage />
    }
    return (
      <div className="row">
        <Cards posts={this.props.postData} />
      </div>
    );
  }
}

function mapStateToProps({ posts: { postData, isPending }, error }) {
  return {
    postData,
    isPending,
    error
  };
}

export default connect(
  mapStateToProps,
  { fetchPosts }
)(PostIndex);
