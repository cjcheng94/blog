import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions";

import Cards from "./Cards";

class PostIndex extends Component {
	componentDidMount() {
		this.props.fetchPosts();
	}
	render() {
		if (!this.props.posts) {
			return (
				<div className="progress">
					<div className="indeterminate" />
				</div>
			);
		}

		return (
			<div className="row">
				<Cards posts={this.props.posts} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { posts: state.posts };
}

export default connect(mapStateToProps, { fetchPosts: fetchPosts })(PostIndex);
