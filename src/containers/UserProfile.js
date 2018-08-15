import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/posts";

import ErrorPage from "../components/errorPage";
import Cards from "../components/cards";

class UserProfile extends Component {
  componentDidMount() {
    //if this.props.posts is already there, don't waste network usage on fetching again
    if (Object.keys(this.props.posts).length === 0) {
      this.props.fetchPosts();
    }
  }
  render() {
    const { error, userPosts, userFilter } = this.props;
    return (
      <div className="row container">
        <h2 className="center-align">Posts By {userFilter}</h2>
        {error && error.status ? <ErrorPage /> : null}
        <Cards posts={userPosts} />
      </div>
    );
  }
}

function mapStateToProps({ posts, error, isPending }, ownProps) {
  //filter all posts whose author field matches the username in url
  const userPosts = {};
  for (let key in posts) {
    if (posts[key]["author"] === ownProps.match.params.username) {
      userPosts[key] = posts[key];
    }
  }
  return {
    posts,
    userPosts,
    isPending,
    error,
    userFilter: ownProps.match.params.username
  };
}

export default connect(
  mapStateToProps,
  { fetchPosts }
)(UserProfile);
