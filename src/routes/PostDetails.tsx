import React, { useState, useEffect, Fragment } from "react";
import { useQuery } from "@apollo/client";
import { Link, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { GET_CURRENT_POST } from "../gqlDocuments";
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
import { loadingVar } from "../cache";

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
type Props = RouteComponentProps<TParams>;

const PostDetails: React.FC<Props> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [clickedConfirm, setClickedConfirm] = useState(false);
  const classes = useStyles();
  const { loading, error, data } = useQuery(GET_CURRENT_POST, {
    variables: { _id: props.match.params._id }
  });

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  if (error) {
    return <ErrorAlert error={error} />;
  }

  if (loading || !data) {
    return null;
  }

  const post = data.getPostById;

  // Show error page if any
  if (!post) {
    return null;
  }

  const url = `/posts/edit/${props.match.params._id}`;
  const currentUsername = localStorage.getItem("currentUsername");
  const isAuthenticated = !checkIfExpired();
  const { title, authorInfo, content, date } = post;
  const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");
  const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";

  const handleDelete = () => {
    setClickedConfirm(true); // TODO
    return;
    // const { _id } = props.match.params;
    // //Disable confirm button once it's clicked
    // setClickedConfirm(true);
    // const deletCallback = () => {
    //   setShowAlert(true);
    //   setTimeout(() => {
    //     props.history.push("/");
    //   }, 1000);
    // };
    // props.deletePost({ _id, callback: deletCallback }); TODO
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

  const userPostUrl = `/user/profile/${
    authorInfo._id
  }?username=${encodeURIComponent(authorInfo.username)}`;

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <div className={classes.wrapper}>
        <Typography variant="h3" gutterBottom>
          {title}
        </Typography>
        <Typography variant="body2">
          By{" "}
          <Link className={classes.author} to={userPostUrl}>
            {authorInfo.username}
          </Link>
        </Typography>
        <Typography variant="body2" gutterBottom>
          {postTime}
        </Typography>
        <Divider />
        {renderContent(content)}
        {/* Conditionally render 'Edit' and 'Delete' buttons*/}
        {authorInfo.username === currentUsername && isAuthenticated ? (
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
        <DisqusComment identifier={props.match.params._id} title={title} />
      </div>
    </Fragment>
  );
};

export default PostDetails;
