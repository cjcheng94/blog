import React, { Component } from "react";
import map from "lodash/map";
import { Link } from "react-router-dom";

export default class Cards extends Component {
  render() {
    //this.props.posts is an object
    return map(this.props.posts, post => {
      const url = `/posts/detail/${post._id}`;
      return (
        <div className="col s12 m4 l3 " key={post._id}>
          <Link to={url} className="card-link">
            <div className="card small hoverable">
              <div className="card-content">
                <span className="card-title">{post.title}</span>
                <p className="card-author">By {post.author}</p>
                <p className="card-article">{post.content.slice(0, 60)} ...</p>
              </div>
            </div>
          </Link>
        </div>
      );
    });
  }
}
