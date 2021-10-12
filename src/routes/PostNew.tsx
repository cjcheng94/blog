import React, { useState, useEffect, Fragment, FormEvent } from "react";
import { useMutation } from "@apollo/client";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  makeStyles,
  Snackbar,
  TextField,
  Button,
  Typography,
  FormHelperText
} from "@material-ui/core";
import { ErrorAlert, CustomDialog, RichTextEditor } from "@components";
import { CREATE_NEW_POST, GET_ALL_POSTS } from "../gqlDocuments";
import { loadingVar } from "../cache";

const useStyles = makeStyles(theme => ({
  formNew: {
    maxWidth: 1000,
    margin: "0px auto"
  },
  button: {
    marginTop: 20,
    marginRight: 20
  }
}));

const PostNew: React.FC<RouteComponentProps> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [createNewPost, { loading, error, data, called }] = useMutation(
    CREATE_NEW_POST,
    {
      refetchQueries: [{ query: GET_ALL_POSTS }]
    }
  );
  const classes = useStyles();

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
    // Called Api and successfully got token
    if (called && data) {
      setShowAlert(true);
      setTimeout(() => props.history.push("/"), 1000);
    }
  }, [called, data]);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

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

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setShowCustomDialog(false);
    if (validate()) {
      // Api call
      createNewPost({
        variables: { title, content, tagIds: [] }
      });
    }
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}

      <Typography variant="h4" gutterBottom align="center">
        Write Your Story
      </Typography>

      <form
        id="create-form"
        className={classes.formNew}
        onSubmit={handleSubmit}
      >
        <TextField
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          label={"title"}
          helperText={titleErrorMessage}
          error={!!titleErrorMessage}
          margin="normal"
          type="text"
          fullWidth
        />
        <RichTextEditor
          readOnly={false}
          onChange={setContent}
          isEmpty={setContentEmpty}
        />
        <FormHelperText error>{contentErrorMessage}</FormHelperText>
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
        dialogTitle="Create Story?"
        open={showCustomDialog}
        handleClose={() => {
          setShowCustomDialog(false);
        }}
        isDisabled={false}
        formId="create-form"
        type="submit"
      />
      <Snackbar
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left"
        }}
        open={showAlert}
        autoHideDuration={4000}
        onClose={() => {
          setShowAlert(false);
        }}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">Create new post successfull!</span>}
      />
    </Fragment>
  );
};

export default PostNew;
