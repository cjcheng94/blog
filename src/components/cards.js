import React, { Component } from "react";
import _ from "lodash";
import { Link } from "react-router-dom";

export default class Cards extends Component {
  render() {
    //this.props.posts is an object, hence _.map()
    return _.map(this.props.posts, post => {
      //DANGEROUS! may may expose users to a cross-site scripting (XSS) attack.
      const createMarkup = () => ({
        __html: post.content.slice(0, 60) + "..."
      });
      //----------------------------------------------

      const url = `/posts/detail/${post._id}`;
      return (
        <div className="col s12 m4 l3 " key={post._id}>
          <Link to={url} className="card-link">
            <div className="card small hoverable">
              <div className="card-content">
                <span className="card-title">{post.title}</span>
                <p className="card-author">By {post.author}</p>
                {/* <p className="card-article">{post.content.slice(0, 40)} ...</p> */}
                <div
                  className="card-article"
                  dangerouslySetInnerHTML={createMarkup()}
                />
              </div>
            </div>
          </Link>
        </div>
      );
    });
  }
}
