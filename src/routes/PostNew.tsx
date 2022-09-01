import React, {
  useState,
  useEffect,
  useCallback,
  Fragment,
  FormEvent
} from "react";
import { useMutation } from "@apollo/client";
import { Link, RouteComponentProps } from "react-router-dom";
import {
  Snackbar,
  TextField,
  Button,
  Typography,
  FormHelperText
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import throttle from "lodash/throttle";

import { ErrorAlert, CustomDialog, TagBar, Editor } from "@components";
import {
  CREATE_NEW_POST,
  GET_ALL_POSTS,
  CREATE_DRAFT,
  UPDATE_DRAFT,
  DELETE_DRAFT
} from "../api/gqlDocuments";
import {
  loadingVar,
  accountDialogTypeVar,
  draftUpdatingVar,
  draftErrorVar
} from "../api/cache";
import checkIfExpired from "../utils/checkTokenExpired";
import useCleanup from "../utils/useCleanup";

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

const showAccountDialog = (type: "login" | "signup") => {
  accountDialogTypeVar(type);
};

const PostNew: React.FC<RouteComponentProps> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState("");
  const [richData, setRichData] = useState("");
  const [plainText, setPlainText] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const [
    createNewPost,
    {
      loading: createNewPostLoading,
      error: createNewPostError,
      data: createNewPostData,
      called: createNewPostCalled
    }
  ] = useMutation(CREATE_NEW_POST, {
    refetchQueries: [{ query: GET_ALL_POSTS }]
  });

  const [
    createDraft,
    {
      loading: createDraftLoading,
      error: createDraftError,
      data: createDraftData,
      called: createDraftCalled
    }
  ] = useMutation(CREATE_DRAFT);

  const [
    updateDraft,
    {
      loading: updateDraftLoading,
      error: updateDraftError,
      data: updateDraftData
    }
  ] = useMutation(UPDATE_DRAFT);

  const [
    deleteDraft,
    {
      loading: deleteDraftLoading,
      error: deleteDraftError,
      data: deleteDraftData
    }
  ] = useMutation(DELETE_DRAFT);

  const classes = useStyles();
  const isAuthenticated = !checkIfExpired();
  // Id of newly created draft
  const createdDraftId = createDraftData?.createDraft?._id;

  type DraftVariables = {
    _id: string;
    title: string;
    content: string;
    contentText: string;
    tagIds: string[];
  };
  const updateDraftHandler = (draftVariables: DraftVariables) => {
    updateDraft({
      variables: draftVariables
    });
  };

  // Throttled update draft mutation
  const throttledUpdateDraft = useCallback(
    throttle(updateDraftHandler, 1000 * 5),
    []
  );

  useEffect(() => {
    // We can create/update draft if either title or plainText is present
    if (title || plainText) {
      // Create a draft if we haven't already
      if (!createDraftCalled || !createdDraftId) {
        // Prevent multiple createDraft call
        if (!createDraftLoading) {
          createDraft({
            variables: {
              title,
              content: richData,
              contentText: plainText,
              tagIds: selectedTagIds
            }
          });
        }
        return;
      }

      // User changed content and we've already created a draft,
      // call throttled updateHandler w/ the id from newly created draft to update it
      throttledUpdateDraft({
        _id: createdDraftId,
        title,
        content: richData,
        contentText: plainText,
        tagIds: selectedTagIds
      });
    }
  }, [title, plainText, richData, selectedTagIds]);

  // Use custom hook to delete empty draft when user leaves this route
  useCleanup(
    ({ title, plainText, createdDraftId }) => {
      if (!title && !plainText && createdDraftId) {
        deleteDraft({ variables: { _id: createdDraftId } });
      }
    },
    { title, plainText, createdDraftId }
  );

  useEffect(() => {
    // Promp user to login if they aren't already
    if (!isAuthenticated) {
      showAccountDialog("login");
    }
  }, []);

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
    if (createNewPostCalled && createNewPostData) {
      // Delete draft after user posts
      if (createdDraftId) {
        deleteDraft({ variables: { _id: createdDraftId } });
      }

      // Show success message and redirect to homepage
      setShowAlert(true);
      setTimeout(() => props.history.push("/"), 1000);
    }
  }, [createNewPostCalled, createNewPostData]);

  useEffect(() => {
    loadingVar(createNewPostLoading);
  }, [createNewPostLoading]);

  useEffect(() => {
    draftUpdatingVar(updateDraftLoading);
  }, [updateDraftLoading]);

  useEffect(() => {
    draftErrorVar(!!updateDraftError);
  }, [updateDraftError]);

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
        variables: {
          title,
          content: richData,
          contentText: plainText,
          tagIds: selectedTagIds
        }
      });
    }
  };

  const handleTagsChange = (tag: any) => {
    setSelectedTagIds(prevIds => {
      if (prevIds.includes(tag._id)) {
        return prevIds.filter(id => id !== tag._id);
      }
      return [...prevIds, tag._id];
    });
  };

  const renderSubmitOrLoginButton = () => {
    if (isAuthenticated) {
      return (
        <Button
          className={classes.button}
          onClick={handleSubmitClick}
          disabled={!isAuthenticated}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
      );
    }
    return (
      <Button
        className={classes.button}
        onClick={() => {
          showAccountDialog("login");
        }}
        variant="contained"
        color="primary"
      >
        Log in
      </Button>
    );
  };

  return (
    <Fragment>
      {createNewPostError && <ErrorAlert error={createNewPostError} />}

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
        <TagBar selectedTagIds={selectedTagIds} onChange={handleTagsChange} />
        <Editor
          onRichTextTextChange={setRichData}
          onTextContentChange={setPlainText}
          setContentEmpty={setContentEmpty}
        />
        <FormHelperText error>{contentErrorMessage}</FormHelperText>
        {renderSubmitOrLoginButton()}
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
