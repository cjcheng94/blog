import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions/posts";

import Cards from "../components/cards";
class PostIndex extends Component {
  componentDidMount() {
    this.props.fetchPosts();
  }
  render() {
    return (
      <div className="row">
        <Cards posts={this.props.postData} />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { postData: state.posts.postData };
}

export default connect(
  mapStateToProps,
  { fetchPosts }
)(PostIndex);
