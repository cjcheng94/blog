import React, { Component } from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import Alert from "react-s-alert";
import moment from "moment";

import DisqueComment from '../components/disqus'
import Modal from "../components/modal";
import ErrorPage from "../components/errorPage";
import { fetchPost, deletePost } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    //Reset to top of the page
    window.scrollTo(0, 0);
    //If all posts are already fetched, then don't waste network usage to fetch it again,
    //simply find the post by id in state
    if (!this.props.posts) {
      const { _id } = this.props.match.params;
      this.props.fetchPost(_id);
    }
  }

  showAlert(message) {
    Alert.info(message, {
      position: "top-right",
      effect: "slide",
      timeout: 2000
    });
  }

  handleModalShow() {
    this.setState({
      showModal: true
    });
  }
  handleModalHide() {
    this.setState({
      showModal: false
    });
  }

  handleDelete() {
    const { _id } = this.props.match.params;
    this.props.deletePost(_id, () => {
      this.showAlert("Post deleted");
      this.props.history.push("/");
    });
  }

  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }
  render() {
    // Show error page if any
    const { error } = this.props;
    if (!this.props.posts) {
      if (error && error.status) {
        return <ErrorPage type="postDetail" />;
      }
      return null;
    }

    const { title, author, content, date } = this.props.posts;
    const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    //Extract post id from url, and compose url for editing page
    const { _id } = this.props.match.params;
    const url = `/posts/edit/${_id}`;
    
    return (
      <div className="container">
        {this.state.showModal ? (
          <Modal
            handler={this.handleDelete.bind(this)}
            handleModalHide={this.handleModalHide.bind(this)}
            message="Are you sure you want to delete this article?"
            isPending={this.props.isPending}
          />
        ) : null}
        {error && error.status ? <ErrorPage type="postDetail" /> : null}
        <div className="detail">
          <h3>{title}</h3>
          <h6>
            By <Link to={`/user/profile/${author}`}>{author}</Link>
          </h6>
          <h6>{postTime}</h6>
          <div className="divider" style={{ marginBottom: "30px" }} />
          <div className="post-content">{content}</div>
        </div>
        {/*Disqus plugin*/}
        <DisqueComment identifier={_id} title={title}/>
        {author === this.props.user.username ? (
          <div className="detail-buttons">
            <button
              onClick={this.handleModalShow.bind(this)}
              className="btn waves-effect waves-light red lighten-1 "
            >
              Delete
            </button>
            <Link to={url} className="btn waves-effect waves-light ">
              Edit
            </Link>
          </div>
        ) : null}
      </div>
    );
  }
}

function mapStateToProps({ posts, user, error, isPending }, ownProps) {
  return {
    //Filter posts by id (from url) to find the post we're looking for
    posts: posts[ownProps.match.params._id],
    user,
    isPending,
    error
  };
}

export default connect(
  mapStateToProps,
  { fetchPost, deletePost, clearLoader }
)(PostDetails);
