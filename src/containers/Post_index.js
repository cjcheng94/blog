import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPosts } from "../actions";

import Cards from "../components/cards";
class PostIndex extends Component {
	componentDidMount() {
		// if (!this.props.posts) {
			this.props.fetchPosts();
		// }
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
				<h1>Heller</h1>
				<Cards posts={this.props.posts} />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return { posts: state.posts };
}

export default connect(mapStateToProps, { fetchPosts })(PostIndex);
