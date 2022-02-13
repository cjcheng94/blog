import React, { useState, useEffect, Fragment } from "react";
import { Link, RouteComponentProps } from "react-router-dom";
import { useLazyQuery, useMutation } from "@apollo/client";
import {
  makeStyles,
  Snackbar,
  TextField,
  Button,
  Typography
} from "@material-ui/core";
import { CustomDialog, ErrorAlert, RichTextEditor, TagBar } from "@components";
import { loadingVar } from "../api/cache";
import {
  GET_ALL_POSTS,
  GET_CURRENT_POST,
  UPDATE_POST,
  CREATE_NEW_POST,
  GET_USER_DRAFTS,
  GET_DRAFT_BY_ID,
  UPDATE_DRAFT,
  DELETE_DRAFT
} from "../api/gqlDocuments";

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

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

type TParams = {
  _id: string;
};
type Props = RouteComponentProps<TParams>;

const PostUpdate: React.FC<Props> = props => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [plainText, setPlainText] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [explicitDeleteDraft, setExplicitDeleteDraft] = useState(false);

  const classes = useStyles();

  const { _id } = props.match.params;

  // Get "isDraft" param from url query string
  const urlQuery = getUrlQuery(props.location.search);
  const isDraft = urlQuery.has("isDraft");

  const [
    getCurrentPost,
    {
      loading: getPostLoading,
      error: getPostError,
      data: getPostData,
      called: getPostCalled
    }
  ] = useLazyQuery(GET_CURRENT_POST, {
    variables: { _id }
  });

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

  const [
    getDraftById,
    {
      loading: getDraftLoading,
      error: getDraftError,
      data: getDraftData,
      called: getDraftCalled
    }
  ] = useLazyQuery(GET_DRAFT_BY_ID, {
    variables: { _id }
  });

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
      data: deleteDraftData,
      called: deleteDraftCalled
    }
  ] = useMutation(DELETE_DRAFT, {
    refetchQueries: [{ query: GET_USER_DRAFTS }]
  });

  // Query for post or draft depending on isDraft
  useEffect(() => {
    if (isDraft) {
      getDraftById();
    } else {
      getCurrentPost();
    }
  }, []);

  // Use post data to initialize our form
  useEffect(() => {
    if (getPostCalled && getPostData) {
      const { title, content, tagIds } = getPostData.getPostById;
      setTitle(title);
      setContent(content);
      setSelectedTagIds(tagIds);
    }
  }, [getPostCalled, getPostData]);

  // Use draft data to initialize our form
  useEffect(() => {
    if (getDraftCalled && getDraftData) {
      const { title, content, tagIds } = getDraftData.getDraftById;
      setTitle(title);
      setContent(content);
      setSelectedTagIds(tagIds);
    }
  }, [getDraftCalled, getDraftData]);

  const alertAndRedirect = (alertMessage: string, destination: string) => {
    setAlertMessage(alertMessage);
    setTimeout(() => {
      props.history.push(destination);
    }, 1000);
  };

  // Update success
  useEffect(() => {
    if (updatePostCalled && updatePostData) {
      alertAndRedirect("Update successful", "/");
    }
  }, [updatePostCalled, updatePostData]);

  // Used after create post success,
  // or when user explicitly clicked "delete draft button".
  // We use the "isExplicit" parameter to differentiate between the two use cases
  const deleteOldDraft = (isExplicit: boolean) => () => {
    deleteDraft({ variables: { _id } });
    setExplicitDeleteDraft(isExplicit);
  };

  // Create post success
  useEffect(() => {
    if (createNewPostCalled && createNewPostData) {
      // Delete draft after user successfully created post
      deleteOldDraft(false)();
      alertAndRedirect("Create post successful", "/");
    }
  }, [createNewPostCalled, createNewPostData]);

  // Explicit delete draft success
  useEffect(() => {
    if (deleteDraftCalled && deleteDraftData && explicitDeleteDraft) {
      alertAndRedirect("Deleted draft successful", "/drafts");
    }
  }, [deleteDraftCalled, deleteDraftData]);

  // Clear error messages when user enters text
  useEffect(() => {
    if (title) {
      setTitleErrorMessage("");
    }
  }, [title, contentEmpty]);

  const isLoading = getPostLoading || getDraftLoading || updatePostLoading;
  useEffect(() => {
    loadingVar(isLoading);
  }, [isLoading]);

  // Check if title or content field is empty
  const validate = () => {
    if (title && !contentEmpty) {
      return true;
    }
    if (!title) {
      setTitleErrorMessage("Please enter a title");
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
      // Draft mode, create post
      if (isDraft) {
        createNewPost({
          variables: {
            title,
            content,
            contentText: plainText,
            tagIds: selectedTagIds
          }
        });
      } else {
        // Update mode
        updatePost({
          variables: {
            _id,
            title,
            content,
            contentText: plainText,
            tagIds: selectedTagIds
          }
        });
      }
    }
  };

  const handleRichTextEditorChange = (richData: string, plainText: string) => {
    setContent(richData);
    setPlainText(plainText);
  };

  // Render content field
  const renderContentField = () => {
    if (content) {
      return (
        <RichTextEditor
          readOnly={false}
          rawContent={content}
          onChange={handleRichTextEditorChange}
          isEmpty={setContentEmpty}
        />
      );
    }
    return <div>Loading content...</div>;
  };

  const handleTagsChange = (tag: any) => {
    setSelectedTagIds(prevIds => {
      if (prevIds.includes(tag._id)) {
        return prevIds.filter(id => id !== tag._id);
      }
      return [...prevIds, tag._id];
    });
  };

  // Render a delete draft button when in draft mode
  const getDeleteDraftButton = () => {
    if (isDraft) {
      return (
        <>
          <Button
            className={classes.button}
            onClick={deleteOldDraft(true)}
            variant="contained"
            color="secondary"
          >
            Delete Draft
          </Button>
        </>
      );
    }
  };

  return (
    <Fragment>
      {getPostError && <ErrorAlert error={getPostError} />}
      {getDraftError && <ErrorAlert error={getDraftError} />}
      {updatePostError && <ErrorAlert error={updatePostError} />}
      <form
        id="update-form"
        className={classes.formEdit}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom align="center">
          Edit Your Story
        </Typography>

        <TextField
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
        <TagBar selectedTagIds={selectedTagIds} onChange={handleTagsChange} />
        {renderContentField()}
        <Button
          className={classes.button}
          onClick={handleSubmitClick}
          variant="contained"
          color="primary"
        >
          Submit
        </Button>
        {getDeleteDraftButton()}
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
        dialogTitle={isDraft ? "Create story?" : "Submit changes?"}
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
        open={!!alertMessage}
        autoHideDuration={3000}
        onClose={() => {
          setAlertMessage("");
        }}
        ContentProps={{
          "aria-describedby": "message-id"
        }}
        message={<span id="message-id">{alertMessage}</span>}
      />
    </Fragment>
  );
};

export default PostUpdate;
