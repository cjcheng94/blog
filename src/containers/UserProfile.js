import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchUserPosts } from "../actions/posts";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";

class PostIndex extends Component {
  componentDidMount() {
    const rawUsername = this.props.match.params.username;
    const encodedUsername = encodeURIComponent(rawUsername);
    this.props.fetchUserPosts(encodedUsername);
  }
  render() {
    const { error, postData, username } = this.props;

    return (
      <div className="row container">
        <h2 className="center-align">
          Posts By {this.props.match.params.username}
        </h2>
        {error && error.status ? <ErrorPage /> : null}
        <Cards posts={postData} />
      </div>
    );
  }
}

function mapStateToProps({
  user: { username },
  posts: { postData, isPending },
  error
}) {
  return {
    postData,
    isPending,
    error,
    username
  };
}

export default connect(
  mapStateToProps,
  { fetchUserPosts }
)(PostIndex);
