import React, { useState, useEffect, Fragment } from "react";
import {
  useQuery,
  useMutation,
  useApolloClient,
  useReactiveVar
} from "@apollo/client";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import moment from "moment";
import {
  GET_CURRENT_POST,
  DELETE_POST,
  GET_ALL_POSTS,
  GET_CACHED_POST_FRAGMENT
} from "../api/gqlDocuments";
import { Typography, Divider, Button } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useSnackbar } from "notistack";

import {
  DisqusComment,
  CustomDialog,
  ErrorAlert,
  NewPostButton,
  DisplayTag,
  Editor
} from "@components";
import { loadingVar, isAuthedVar } from "../api/cache";
import { Post, GetPostVars, DeletePostVars } from "PostTypes";
import { useNavigatorOnline } from "@utils";

const useStyles = makeStyles(theme => ({
  wrapper: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  info: {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginBottom: theme.spacing(1)
  },
  tagRow: {
    width: "100%",
    display: "flex"
  },
  divider: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(2)
  },
  author: {
    color: theme.palette.primary.main
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
    fontWeight: "bold"
  },
  title: {
    fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif"
  },
  thumbnail: {
    display: "block",
    margin: "auto",
    marginBottom: theme.spacing(1),
    maxWidth: "100%"
  }
}));

const PostDetails = () => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [clickedConfirm, setClickedConfirm] = useState(false);
  const classes = useStyles();

  const match = useRouteMatch<{ _id: string }>();
  const history = useHistory();

  const { enqueueSnackbar } = useSnackbar();

  const isOnline = useNavigatorOnline();

  // Get post from server
  const {
    loading: getPostLoading,
    error: getPostError,
    data: getPostData
  } = useQuery<{ getPostById: Post }, GetPostVars>(GET_CURRENT_POST, {
    variables: { _id: match.params._id }
  });

  // Get post from cache
  const client = useApolloClient();
  // Apollo client only caches *queries*, so we have to use readFragment.
  // This allows us to read cached post data even when user only called GET_ALL_POSTS
  // and never called GET_CURRENT_POST.
  const cachedPostData: Post | null = client.readFragment({
    id: `Post:${match.params._id}`,
    fragment: GET_CACHED_POST_FRAGMENT
  });

  const [
    deletePost,
    {
      data: deletePostData,
      called: deletePostCalled,
      loading: deletePostLoading,
      error: deletePostError
    }
  ] = useMutation<Post, DeletePostVars>(DELETE_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }]
  });

  useEffect(() => {
    loadingVar(getPostLoading || deletePostLoading);
  }, [getPostLoading, deletePostLoading]);

  useEffect(() => {
    if (deletePostCalled && deletePostData) {
      enqueueSnackbar("Post deleted");
      setShowCustomDialog(false);
      setTimeout(() => {
        history.push("/");
      }, 1000);
    }
  }, [deletePostCalled, deletePostData, enqueueSnackbar, history]);

  const isAuthenticated = useReactiveVar(isAuthedVar);

  let post: Post | null = null;

  if (isOnline) {
    // Hide network error when offline
    if (getPostError) {
      return <ErrorAlert error={getPostError} />;
    }
    if (getPostLoading || !getPostData) {
      return null;
    }
    // If user is online, get post data from the server,
    post = getPostData.getPostById;
  } else {
    // Offline, get data from cache
    post = cachedPostData;
  }

  if (!post) {
    return null;
  }

  const url = `/posts/edit/${match.params._id}`;
  const currentUsername = localStorage.getItem("currentUsername");
  const { title, authorInfo, content, contentText, date, tags, thumbnailUrl } =
    post;
  const postTime = moment(date).format("MMMM Do YYYY, h:mm:ss a");

  const handleDelete = () => {
    setClickedConfirm(true);
    const { _id } = match.params;
    deletePost({ variables: { _id } });
  };

  const displayTags = tags.map(
    tag => tag && <DisplayTag key={tag._id} value={tag.name} />
  );

  const userPostUrl = `/user/profile/${
    authorInfo._id
  }?username=${encodeURIComponent(authorInfo.username)}`;

  return (
    <Fragment>
      {getPostError && isOnline && <ErrorAlert error={getPostError} />}
      {deletePostError && isOnline && <ErrorAlert error={deletePostError} />}
      <div className={classes.wrapper}>
        <Typography variant="h3" gutterBottom className={classes.title}>
          {title}
        </Typography>
        <div className={classes.info}>
          <Typography variant="body2">
            By{" "}
            <Link className={classes.author} to={userPostUrl}>
              {authorInfo.username}
            </Link>
          </Typography>
          <Typography variant="body2">{postTime}</Typography>
        </div>

        <div className={classes.tagRow}>{displayTags}</div>
        <Divider className={classes.divider} />
        {thumbnailUrl && (
          <img src={thumbnailUrl} className={classes.thumbnail} />
        )}
        <Editor
          readOnly={true}
          initialContent={content}
          initialPlainText={contentText}
        />
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

        <NewPostButton />

        <CustomDialog
          dialogTitle="Delete this Article?"
          open={showCustomDialog}
          handleClose={() => setShowCustomDialog(false)}
          handleConfirm={handleDelete}
          isDisabled={clickedConfirm}
        />
        {/*Disqus plugin*/}
        <DisqusComment identifier={match.params._id} title={title} />
      </div>
    </Fragment>
  );
};

export default PostDetails;
