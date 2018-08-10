import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPost, deletePost } from "../actions/posts";
import { Link } from "react-router-dom";
import Alert from "react-s-alert";
import moment from "moment";

import Modal from "../components/modal";
import ErrorPage from "../components/errorPage";

class PostDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidMount() {
    //reset to top of the page
    window.scrollTo(0, 0);
    //if all posts are already fetched, then don't waste network usage to fetch it again
    if (!this.props.postData) {
      const { _id } = this.props.match.params;
      this.props.fetchPost(_id);
    }
  }

  showAlert(message) {
    Alert.success(message, {
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

  render() {
    if (this.props.error && this.props.error.status) {
      return <ErrorPage />
    }
    if (!this.props.postData) {
      return null;
    }
    const { title, author, content, date } = this.props.postData;
    const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    const { _id } = this.props.match.params;
    const url = `/posts/edit/${_id}`;
    //----------------------------------------------
    //DANGEROUS! may may expose users to a cross-site scripting (XSS) attack.
    const createMarkup = () => ({ __html: content });
    //----------------------------------------------
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

        <div className="detail">
          <h3>{title}</h3>
          <h6>
            By <i>{author}</i>
          </h6>
          <h6>{postTime}</h6>
          <div className="divider" style={{ marginBottom: "30px" }} />
          <div
            className="post-content"
            dangerouslySetInnerHTML={createMarkup()}
          />
        </div>
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

function mapStateToProps(
  { posts: { postData, isPending }, user, error },
  ownProps
) {
  return {
    postData: postData[ownProps.match.params._id],
    user,
    isPending,
    error
  };
}

export default connect(
  mapStateToProps,
  { fetchPost, deletePost }
)(PostDetails);
