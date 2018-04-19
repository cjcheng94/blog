import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

export default class Cards extends Component {
	// handleMouseEnter(){
	// 	const className = `card samll z-depth-5`;
	// 	console.log(className);
	// }

	render() {
		return _.map(this.props.posts, post => {
			const url = `/posts/detail/${post._id}`;
			return (
				<div className="col s12 m4 l3 " key={post._id}>
				<Link to={url} className='card-link'>
					<div className="card small hoverable">
						<div className="card-content">
							<span className="card-title">{post.title}</span>
							<p className="card-author">By {post.author}</p>
							<p className="card-article">{post.content.slice(0, 40)} ...</p>
						</div>
					</div>
					</Link>
				</div>
			);
		});
	}
}
