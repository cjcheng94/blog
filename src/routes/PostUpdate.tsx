import React, { useState, useEffect, Fragment } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  makeStyles,
  Snackbar,
  TextField,
  Button,
  Typography
} from "@material-ui/core";
import { CustomDialog, ErrorAlert, RichTextEditor } from "@components";
import { GET_CURRENT_POST, UPDATE_POST, GET_ALL_POSTS } from "../gqlDocuments";
import { useQuery, useMutation } from "@apollo/client";
import { loadingVar } from "../cache";

const useStyles = makeStyles(theme => ({
  formEdit: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
}));

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

type TParams = {
  _id: string;
};
type Props = RouteComponentProps<TParams>;

const PostUpdate: React.FC<Props> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const classes = useStyles();

  const { _id } = props.match.params;
  const {
    loading: getPostLoading,
    error: getPostError,
    data: getPostData,
    called: getPostCalled
  } = useQuery(GET_CURRENT_POST, {
    variables: { _id }
  });
  const [
    updatePost,
    {
      loading: updatePostLoading,
      error: updatePostError,
      data: updatePostData,
      called: updatePostCalled
    }
  ] = useMutation(UPDATE_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }]
  });

  // After get post actions
  useEffect(() => {
    if (getPostCalled && getPostData) {
      const { title, content } = getPostData.getPostById;
      setTitle(title);
      setContent(content);
    }
  }, [getPostCalled, getPostData]);

  // After update actions
  useEffect(() => {
    if (updatePostCalled && updatePostData) {
      setShowAlert(true);
      setTimeout(() => {
        props.history.push("/");
      }, 1000);
    }
  }, [updatePostCalled, updatePostData]);

  // Clear error messages when user enters text
  useEffect(() => {
    if (title) {
      setTitleErrorMessage("");
    }
    if (!contentEmpty) {
      setContentErrorMessage("");
    }
  }, [title, contentEmpty]);

  useEffect(() => {
    loadingVar(updatePostLoading || updatePostLoading);
  }, [getPostLoading, updatePostLoading]);

  // Check if title or content field is empty
  const validate = () => {
    if (title && !contentEmpty) {
      return true;
    }
    if (!title) {
      setTitleErrorMessage("Please enter a title");
    }
    if (contentEmpty) {
      setContentErrorMessage("Content can't be empty");
    }
    return false;
  };

  // Check if any field is empty before showing confirm dialog
  const handleSubmitClick = () => {
    const isValid = validate();
    if (isValid) {
      setShowCustomDialog(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomDialog(false);
    if (validate()) {
      // Api call
      updatePost({
        variables: { _id, title, content }
      });
    }
  };

  // Render content field
  const renderContentField = () => {
    // Temporary solution, add isRichText prop later
    const isContentJson = isJson(content);
    // content is rich text format
    if (isContentJson) {
      return (
        <RichTextEditor
          readOnly={false}
          rawContent={content}
          onChange={setContent}
          isEmpty={setContentEmpty}
        />
      );
    }
    // content is a plain string
    return (
      <TextField
        label={name}
        value={content}
        onChange={e => {
          setContent(e.target.value);
        }}
        helperText={contentErrorMessage}
        error={!!contentErrorMessage}
        multiline
        rows="4"
        rowsMax="900"
        margin="normal"
        type="text"
        variant="outlined"
        fullWidth
      />
    );
  };

  return (
    <Fragment>
      <form
        id="update-form"
        className={classes.formEdit}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom align="center">
          Edit Your Story
        </Typography>

        {getPostError || updatePostError ? (
          <ErrorAlert type="postUpdate" />
        ) : null}

        <TextField
          label={name}
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          helperText={titleErrorMessage}
          error={!!titleErrorMessage}
          margin="normal"
          type="text"
          variant="outlined"
          fullWidth
        />
        {renderContentField()}

        <Button
          className={classes.button}
          onClick={handleSubmitClick}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          component={Link}
          to="/"
        >
          Back
        </Button>
      </form>

      <CustomDialog
        dialogTitle="Submit changes?"
        open={showCustomDialog}
        handleClose={() => {
          setShowCustomDialog(false);
        }}
        isDisabled={false}
        formId="update-form"
        type="submit"
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
        message={<span id="message-id">Update successful!</span>}
      />
    </Fragment>
  );
};

export default PostUpdate;
