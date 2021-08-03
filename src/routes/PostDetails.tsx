import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import { Link, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import {
  Snackbar,
  Typography,
  Divider,
  Tooltip,
  Button,
  makeStyles
} from "@material-ui/core";

import {
  DisqusComment,
  CustomDialog,
  ErrorAlert,
  NewPostButton,
  RichTextEditor
} from "@components";

import { iRootState, Dispatch } from "../store";

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  content: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
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
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    fontWeight: "bold"
  }
}));

type TParams = { _id: string };
type OwnProps = RouteComponentProps<TParams>;

const mapState = (state: iRootState, ownProps: OwnProps) => ({
  post: state.posts[ownProps.match.params._id],
  user: state.user,
  stateError: state.error
});

const mapDispatch = (dispatch: Dispatch) => ({
  fetchPost: dispatch.posts.fetchPost,
  fetchPosts: dispatch.posts.fetchPosts,
  deletePost: dispatch.posts.deletePost
});

type Props = ReturnType<typeof mapState> &
  ReturnType<typeof mapDispatch> &
  RouteComponentProps<TParams>;

const PostDetails: React.FC<Props> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [clickedConfirm, setClickedConfirm] = useState(false);
  const classes = useStyles();

  const {
    stateError,
    user: { isAuthenticated }
  } = props;

  //Extract post id from url, and compose url for editing page
  const { _id } = props.match.params;
  const url = `/posts/edit/${_id}`;

  // Show error page if any
  if (!props.post) {
    if (stateError.showError) {
      return <ErrorAlert type="postDetail" />;
    }
    return null;
  }

  const { title, author, content, date } = props.post;
  const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");
  const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";

  useEffect(() => {
    //Reset to top of the page
    window.scrollTo(0, 0);

    if (window.navigator.onLine) {
      if (!props.post) {
        // If a user refreshs a detail page or lands here via url,
        // only fetch the post whose id corresponds to the id in the url
        const { _id } = props.match.params;
        props.fetchPost({ _id });
      }
    } else {
      //In offline mode, fetch posts from runtime cache
      props.fetchPosts();
    }
  }, []);

  const handleDelete = () => {
    const { _id } = props.match.params;
    //Disable confirm button once it's clicked
    setClickedConfirm(true);
    const deletCallback = () => {
      setShowAlert(true);
      setTimeout(() => {
        props.history.push("/");
      }, 1000);
    };
    props.deletePost({ _id, callback: deletCallback });
  };

  const isJson = (str: string) => {
    if (typeof str !== "string") {
      return false;
    }
    try {
      JSON.parse(str);
    } catch (error) {
      return false;
    }
    return true;
  };

  const renderContent = (content: string) => {
    // Temporary solution, add isRichText prop later
    const isContentJson = isJson(content);

    if (isContentJson) {
      return <RichTextEditor readOnly={true} rawContent={content} />;
    }
    return (
      <Typography variant="body1" className={classes.content}>
        {content}
      </Typography>
    );
  };

  return (
    <Fragment>
      <div className={classes.wrapper}>
        {stateError.showError && <ErrorAlert type="postDetail" />}

        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">
          By{" "}
          <Link
            className={classes.author}
            to={`/user/profile/${encodeURIComponent(author)}`}
          >
            {author}
          </Link>
        </Typography>
        <Typography variant="body2" gutterBottom>
          {postTime}
        </Typography>
        <Divider />
        {renderContent(content)}
        {/* Conditionally render 'Edit' and 'Delete' buttons*/}
        {author === props.user.username && isAuthenticated ? (
          <Fragment>
            <Button
              className={classes.button}
              onClick={() => setShowCustomDialog(true)}
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

        {/* Direct user to sign up page or if already signed in, write new page */}
        <Tooltip title="Write a story">
          <NewPostButton destination={writeButtonPath} />
        </Tooltip>

        <CustomDialog
          dialogTitle="Delete this Article?"
          open={showCustomDialog}
          handleClose={() => setShowCustomDialog(false)}
          handleConfirm={handleDelete}
          isDisabled={clickedConfirm}
        />

        <Snackbar
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "left"
          }}
          open={showAlert}
          autoHideDuration={3000}
          onClose={() => {
            setShowAlert(false);
          }}
          ContentProps={{
            "aria-describedby": "message-id"
          }}
          message={<span id="message-id">Post deleted</span>}
        />

        {/*Disqus plugin*/}
        <DisqusComment identifier={_id} title={title} />
      </div>
    </Fragment>
  );
};

export default connect(mapState, mapDispatch)(PostDetails);
