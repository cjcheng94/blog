import React, { useState, useEffect, useCallback, Fragment } from "react";
import { Link, useRouteMatch, useHistory } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import debounce from "lodash/debounce";
import { TextField, Button, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useSnackbar } from "notistack";

import { CustomDialog, useErrorAlert, TagBar, Editor } from "@components";
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
import { uploadImage } from "../api/imgur";
import { UpdateDraftMutationVariables } from "@graphql";

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
  },
  thumbnailButton: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1)
  },
  input: {
    display: "none"
  },
  thumbnail: {
    display: "block",
    margin: "auto",
    marginBottom: theme.spacing(1),
    maxWidth: "100%"
  }
}));

const PostUpdate = () => {
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showApplyDraftDialog, setShowApplyDraftDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [richTextData, setRichTextData] = useState("");
  const [plainText, setPlainText] = useState("");
  const [initialRichTextData, setInitialRichTextData] = useState("");
  const [initialPlainText, setInitialPlainText] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [draftId, setDraftId] = useState("");
  const [editorKey, setEditorKey] = useState(1);

  const classes = useStyles();
  const history = useHistory();
  const match = useRouteMatch<{ _id: string }>();
  const { enqueueSnackbar } = useSnackbar();
  const { showErrorAlert } = useErrorAlert();

  const { _id: postId } = match.params;

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

  // updateDraftError is handled by AutoSaveSpinner, so we don't have to show an error alert for it,
  // we want the other errors to fail silently
  const error = updatePostError || getPostError;

  useEffect(() => {
    showErrorAlert(error);
  }, [error, showErrorAlert]);

  // Use post data to initialize our form
  useEffect(() => {
    if (getPostCalled && getPostData) {
      const { title, content, contentText, tagIds, thumbnailUrl } =
        getPostData.getPostById!;
      setTitle(title);
      setInitialRichTextData(content);
      setInitialPlainText(contentText);
      setRichTextData(content);
      setPlainText(contentText);
      setSelectedTagIds(tagIds);
      setThumbnailUrl(thumbnailUrl ?? "");
    }
  }, [getPostCalled, getPostData]);

  useEffect(() => {
    // There's no corresponding draft, create one
    if (getDraftByPostIdCalled && getDraftByPostIdError) {
      const noDraft = getDraftByPostIdError?.message === "Cannot find draft";

      if (noDraft && getPostData) {
        const { title, content, contentText, tagIds } =
          getPostData.getPostById!;
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
      const draftId = createDraftData.createDraft!._id;
      setDraftId(draftId);
    }
  }, [createDraftData, createDraftCalled]);

  const updateDraftHandler = (draftVariables: UpdateDraftMutationVariables) => {
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
        thumbnailUrl,
        content: richTextData,
        contentText: plainText,
        tagIds: selectedTagIds
      });
    }
  }, [
    title,
    plainText,
    richTextData,
    selectedTagIds,
    draftId,
    debouncedUpdateDraft,
    postId,
    thumbnailUrl
  ]);

  // Update success
  useEffect(() => {
    if (updatePostCalled && updatePostData) {
      deleteDraft({ variables: { _id: draftId } });
      enqueueSnackbar("Update successful");
      setTimeout(() => {
        history.push("/");
      }, 1000);
    }
  }, [
    deleteDraft,
    draftId,
    enqueueSnackbar,
    history,
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
          thumbnailUrl,
          content: richTextData,
          contentText: plainText,
          tagIds: selectedTagIds
        }
      });
    }
  };

  // Render content field
  const renderContentField = () => {
    if (initialRichTextData) {
      return (
        <Editor
          key={editorKey}
          initialContent={initialRichTextData}
          initialPlainText={initialPlainText}
          onRichTextTextChange={setRichTextData}
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

  const handleImageInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const handleImage = async (file: File) => {
      const { success, link, errorMessage } = await uploadImage(file);
      if (success) {
        setThumbnailUrl(link);
        return;
      }
      enqueueSnackbar(errorMessage, { variant: "error" });
    };

    if (event.target.files) {
      const file = event.target.files[0];
      if (!file) {
        return;
      }
      // File size limit of 5 MB
      if (file.size > 5 * 1024 * 1024) {
        enqueueSnackbar("File size exceeded 5MB limit", {
          variant: "warning"
        });
      } else {
        handleImage(file);
      }
    }
    // reset input value, otherwise repeated upload of the same image won't trigger
    // change event
    event.target.value = "";
  };

  const applyDraft = () => {
    const { title, content, contentText, tagIds, thumbnailUrl } =
      getDraftByPostIdData!.getDraftByPostId;
    setTitle(title);
    setInitialRichTextData(content);
    setInitialPlainText(contentText);
    setRichTextData(content);
    setPlainText(contentText);
    setSelectedTagIds(tagIds);
    setThumbnailUrl(thumbnailUrl ?? "");
    setEditorKey(2);
    setShowApplyDraftDialog(false);
  };

  return (
    <Fragment>
      <form
        id="update-form"
        className={classes.formEdit}
        onSubmit={handleSubmit}>
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
        <label>
          <Button className={classes.thumbnailButton} component="span">
            Upload thumbnail
          </Button>
          <input
            type="file"
            accept="image/*"
            className={classes.input}
            onChange={handleImageInputChange}
          />
        </label>
        <Button color="error" onClick={() => setThumbnailUrl("")}>
          Remove Thumbnail
        </Button>
        {thumbnailUrl && (
          <img src={thumbnailUrl} className={classes.thumbnail} />
        )}
        {renderContentField()}
        <Button
          className={classes.button}
          onClick={handleSubmitClick}
          variant="contained"
          color="primary">
          Submit
        </Button>
        <Button
          className={classes.button}
          variant="contained"
          color="secondary"
          component={Link}
          to="/">
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
    </Fragment>
  );
};

export default PostUpdate;
