import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Link } from "react-router-dom";
import moment from "moment";

import { withStyles } from "@material-ui/core";
import Snackbar from "@material-ui/core/Snackbar";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Tooltip from "@material-ui/core/Tooltip";
import Button from "@material-ui/core/Button";
import Edit from "@material-ui/icons/Edit";

import DisqueComment from "../components/disqus";
import CustomDialog from "../components/customDialog";
import ErrorAlert from "../containers/ErrorAlert";
import { fetchPost, fetchPosts, deletePost } from "../actions/posts";
import { clearLoader } from "../actions/clearLoader";

const styles = theme => ({
  wrapper: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  title: {
    color: "#000"
  },
  content: {
    marginTop: theme.spacing.unit * 2,
    marginBottom: theme.spacing.unit * 2,
    fontSize: 18,
    whiteSpace: "pre-wrap",
    lineHeight: 1.58,
    letterSpacing: -"0.003em"
  },
  author: {
    "&:visited": {
      color: "blue"
    }
  },
  button: {
    marginTop: theme.spacing.unit * 2,
    marginRight: theme.spacing.unit,
    fontWeight: "bold"
  },
  fab: {
    position: "fixed",
    bottom: "2em",
    right: "2em"
  }
});

class PostDetails extends Component {
  state = {
    showCustomDialog: false,
    showAlert: false,
    clickedConfirm: false
  };

  componentDidMount() {
    //Reset to top of the page
    window.scrollTo(0, 0);

    if (window.navigator.onLine) {
      if (!this.props.posts) {
        // If a user refreshs a detail page or lands here via url,
        // only fetch the post whose id corresponds to the id in the url
        const { _id } = this.props.match.params;
        this.props.fetchPost(_id);
      }
    } else {
      //In offline mode, fetch posts from runtime cache
      this.props.fetchPosts();
    }
  }
  componentWillUnmount() {
    //Clear the progress bar on unmount
    this.props.clearLoader();
  }
  showAlert() {
    this.setState({ showAlert: true });
  }
  hideAlert() {
    this.setState({ showAlert: false });
  }
  handleCustomDialogShow() {
    this.setState({
      showCustomDialog: true
    });
  }
  handleCustomDialogHide() {
    this.setState({
      showCustomDialog: false
    });
  }

  handleDelete() {
    const { _id } = this.props.match.params;
    //Disable confirm button once it's clicked
    this.setState({ clickedConfirm: true });
    this.props.deletePost(_id, () => {
      this.showAlert();
      setTimeout(() => {
        this.props.history.push("/");
      }, 1000);
    });
  }

  render() {
    // Show error page if any
    const { error, classes } = this.props;
    if (!this.props.posts) {
      if (error.status) {
        return <ErrorAlert type="postDetail" />;
      }
      return null;
    }

    const { title, author, content, date } = this.props.posts;
    const {
      user: { isAuthenticated }
    } = this.props;
    const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");

    //Extract post id from url, and compose url for editing page
    const { _id } = this.props.match.params;
    const url = `/posts/edit/${_id}`;

    return (
      <Fragment>
        <div className={classes.wrapper}>
          {error && error.status ? <ErrorAlert type="postDetail" /> : null}

          <Typography variant="display2" className={classes.title} gutterBottom>
            {title}
          </Typography>
          <Typography variant="body2">
            By{" "}
            <Link className={classes.author} to={`/user/profile/${author}`}>
              {author}
            </Link>
          </Typography>
          <Typography variant="body2" gutterBottom>
            {postTime}
          </Typography>
          <Divider />
          <Typography variant="body1" className={classes.content}>
            {content}
          </Typography>
          {author === this.props.user.username ? (
            <Fragment>
              <Button
                className={classes.button}
                onClick={this.handleCustomDialogShow.bind(this)}
                variant="contained"
                color="secondary"
              >
                Delete
              </Button>
              <Button
                className={classes.button}
                component={Link}
                to={url}
                variant="contained"
                color="primary"
              >
                Edit
              </Button>
            </Fragment>
          ) : null}
          {isAuthenticated && (
            <Tooltip title="Write a story">
              <Button
                variant="fab"
                color="secondary"
                aria-label="Edit"
                className={classes.fab}
                component={Link}
                to="/posts/new"
              >
                <Edit />
              </Button>
            </Tooltip>
          )}
          <CustomDialog
            dialogTitle="Delete this Article?"
            open={this.state.showCustomDialog}
            handleClose={this.handleCustomDialogHide.bind(this)}
            handleConfirm={this.handleDelete.bind(this)}
            isDisabled={this.state.clickedConfirm}
          />
          <Snackbar
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "left"
            }}
            open={this.state.showAlert}
            autoHideDuration={3000}
            onClose={this.hideAlert.bind(this)}
            ContentProps={{
              "aria-describedby": "message-id"
            }}
            message={<span id="message-id">Post deleted</span>}
          />
          {/*Disqus plugin*/}
          <DisqueComment identifier={_id} title={title} />
        </div>
      </Fragment>
    );
  }
}

function mapStateToProps({ posts, user, error }, ownProps) {
  return {
    //Filter posts by id (from url) to find the post we're looking for
    posts: posts[ownProps.match.params._id],
    user,
    error
  };
}

export default compose(
  withStyles(styles, {
    name: "PostDetails"
  }),
  connect(
    mapStateToProps,
    { fetchPost, fetchPosts, deletePost, clearLoader }
  )
)(PostDetails);
