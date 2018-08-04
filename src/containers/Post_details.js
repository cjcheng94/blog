import React, { Component } from "react";
import { connect } from "react-redux";
import { fetchPost, deletePost } from "../actions";
import { Link } from "react-router-dom";
import Alert from "react-s-alert";
import Modal from "../components/modal";

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
    //if there's already a post, then don't waste network usage to fetch it again
    if (!this.props.post) {
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
    if (!this.props.post) {
      return (
        <div className="progress">
          <div className="indeterminate" />
        </div>
      );
    }

    const { title, author, content } = this.props.post;
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
          />
        ) : null}

        <div className="detail">
          <h3>{title}</h3>
          <h6>By {author}</h6>
          <div className="divider" style={{marginBottom: '30px'}}/>
          <div className="post-content" dangerouslySetInnerHTML={createMarkup()} />
        </div>
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
      </div>
    );
  }
}

function mapStateToProps({ posts }, ownProps) {
  return { post: posts[ownProps.match.params._id] };
}

export default connect(
  mapStateToProps,
  { fetchPost, deletePost }
)(PostDetails);
