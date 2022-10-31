import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import debounce from "lodash/debounce";
import { Snackbar, TextField, Button, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { CustomDialog, ErrorAlert, TagBar, Editor } from "@components";
import { loadingVar, draftUpdatingVar, draftErrorVar } from "../api/cache";
import {
  GET_ALL_POSTS,
  GET_CURRENT_POST,
  UPDATE_POST,
  GET_USER_DRAFTS,
  GET_DRAFT_BY_POSTID,
  CREATE_DRAFT,
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
  },
  title: {
    "& input": {
      fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif"
    }
  }
}));

type DraftVariables = {
  _id: string;
  postId: string;
  title: string;
  content: string;
  contentText: string;
  tagIds: string[];
};

const PostUpdate = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showApplyDraftDialog, setShowApplyDraftDialog] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [title, setTitle] = useState("");
  const [content, setRichData] = useState("");
  const [plainText, setPlainText] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [draftId, setDraftId] = useState("");
  const [editorKey, setEditorKey] = useState(1);

  const classes = useStyles();

  const history = useHistory();
  const match = useRouteMatch<{ _id: string }>();

  const { _id: postId } = match.params;
  const isOnline = navigator.onLine;

  const {
    loading: getPostLoading,
    error: getPostError,
    data: getPostData,
    called: getPostCalled
  } = useQuery(GET_CURRENT_POST, {
    variables: { _id: postId }
  });

  const {
    loading: getDraftByPostIdLoading,
    error: getDraftByPostIdError,
    data: getDraftByPostIdData,
    called: getDraftByPostIdCalled
  } = useQuery(GET_DRAFT_BY_POSTID, {
    variables: {
      postId
    },
    // The no-cache policy is because we have a debounced draft update that's being called many times,
    // and that will cause the cached draft to update,
    // which in turn causes this hook being called multiple times unnecessarily
    fetchPolicy: "no-cache"
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

  // Use post data to initialize our form
  useEffect(() => {
    if (getPostCalled && getPostData) {
      const { title, content, contentText, tagIds } = getPostData.getPostById;
      setTitle(title);
      setRichData(content);
      setPlainText(contentText);
      setSelectedTagIds(tagIds);
    }
  }, [getPostCalled, getPostData]);

  useEffect(() => {
    // There's no corresponding draft, create one
    if (getDraftByPostIdCalled && getDraftByPostIdError) {
      const noDraft = getDraftByPostIdError?.message === "Cannot find draft";

      if (noDraft && getPostData) {
        const { title, content, contentText, tagIds } = getPostData.getPostById;
        createDraft({
          variables: {
            postId,
            title,
            content,
            contentText,
            tagIds
          }
        });
      }
    }
  }, [
    getDraftByPostIdCalled,
    getDraftByPostIdError,
    getPostData,
    createDraft,
    postId
  ]);

  useEffect(() => {
    // There is a corresponding draft
    if (getDraftByPostIdCalled && getDraftByPostIdData) {
      const draftId = getDraftByPostIdData.getDraftByPostId._id;
      setDraftId(draftId);
      setShowApplyDraftDialog(true);
    }
  }, [getDraftByPostIdCalled, getDraftByPostIdData]);

  useEffect(() => {
    if (createDraftCalled && createDraftData) {
      const draftId = createDraftData.createDraft._id;
      setDraftId(draftId);
    }
  }, [createDraftData, createDraftCalled]);

  const updateDraftHandler = (draftVariables: DraftVariables) => {
    updateDraft({
      variables: draftVariables
    });
  };

  // Debounced update draft mutation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateDraft = useCallback(
    debounce(updateDraftHandler, 1000 * 5),
    []
  );

  // If user changed content, call debounced updateHandler to update draft
  useEffect(() => {
    if (!draftId) {
      return;
    }
    // Update draft
    if (title || plainText) {
      debouncedUpdateDraft({
        _id: draftId,
        postId,
        title,
        content,
        contentText: plainText,
        tagIds: selectedTagIds
      });
    }
  }, [
    title,
    plainText,
    content,
    selectedTagIds,
    draftId,
    debouncedUpdateDraft,
    postId
  ]);

  const alertAndRedirect = useCallback(
    (alertMessage: string, destination: string) => {
      setAlertMessage(alertMessage);
      setTimeout(() => {
        history.push(destination);
      }, 1000);
    },
    [history]
  );

  // Update success
  useEffect(() => {
    if (updatePostCalled && updatePostData) {
      deleteDraft({ variables: { _id: draftId } });
      alertAndRedirect("Update successful", "/");
    }
  }, [
    alertAndRedirect,
    deleteDraft,
    draftId,
    updatePostCalled,
    updatePostData
  ]);

  // Clear error messages when user enters text
  useEffect(() => {
    if (title) {
      setTitleErrorMessage("");
    }
  }, [title]);

  const isLoading = getPostLoading || updatePostLoading;

  useEffect(() => {
    loadingVar(isLoading);
  }, [isLoading]);

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
    return false;
  };

  // Check if any field is empty before showing confirm dialog
  const handleSubmitClick = () => {
    const isValid = validate();
    if (isValid) {
      setShowConfirmDialog(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowConfirmDialog(false);
    if (validate()) {
      // Update mode
      updatePost({
        variables: {
          _id: postId,
          title,
          content,
          contentText: plainText,
          tagIds: selectedTagIds
        }
      });
    }
  };

  // Render content field
  const renderContentField = () => {
    if (content) {
      return (
        <Editor
          key={editorKey}
          initialContent={content}
          initialPlainText={plainText}
          onRichTextTextChange={setRichData}
          onTextContentChange={setPlainText}
          setContentEmpty={setContentEmpty}
        />
      );
    }
    return <div>Loading content...</div>;
  };

  const handleTagsChange = useCallback((tag: any) => {
    setSelectedTagIds(prevIds => {
      if (prevIds.includes(tag._id)) {
        return prevIds.filter(id => id !== tag._id);
      }
      return [...prevIds, tag._id];
    });
  }, []);

  const applyDraft = () => {
    const { title, content, contentText, tagIds } =
      getDraftByPostIdData.getDraftByPostId;
    setTitle(title);
    setRichData(content);
    setPlainText(contentText);
    setSelectedTagIds(tagIds);
    setEditorKey(2);
    setShowApplyDraftDialog(false);
  };

  return (
    <Fragment>
      {getPostError && isOnline && <ErrorAlert error={getPostError} />}
      {updatePostError && isOnline && <ErrorAlert error={updatePostError} />}
      <form
        id="update-form"
        className={classes.formEdit}
        onSubmit={handleSubmit}
      >
        <Typography variant="h4" gutterBottom align="center">
          Edit Your Story
        </Typography>

        <TextField
          className={classes.title}
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
        dialogTitle="Apply unsaved changes?"
        open={showApplyDraftDialog}
        handleConfirm={applyDraft}
        handleClose={() => {
          setShowApplyDraftDialog(false);
        }}
        isDisabled={false}
        type="button"
      />

      <CustomDialog
        dialogTitle="Submit changes?"
        open={showConfirmDialog}
        handleClose={() => {
          setShowConfirmDialog(false);
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
