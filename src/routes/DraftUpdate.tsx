import React, { useState, useEffect, Fragment, useCallback } from "react";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { useQuery, useMutation, useApolloClient } from "@apollo/client";
import debounce from "lodash/debounce";
import { TextField, Button, Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useSnackbar } from "notistack";

import { CustomDialog, useErrorAlert, TagBar, Editor } from "@components";
import { useNavigatorOnline } from "@utils";
import { loadingVar, draftUpdatingVar, draftErrorVar } from "../api/cache";
import { uploadImage } from "../api/imgur";

import {
  GET_ALL_POSTS,
  CREATE_NEW_POST,
  GET_USER_DRAFTS,
  GET_DRAFT_BY_ID,
  UPDATE_DRAFT,
  DELETE_DRAFT,
  GET_CACHED_DRAFT_FRAGMENT
} from "../api/gqlDocuments";
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

const DraftUpdate = () => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [richTextData, setRichTextData] = useState("");
  const [plainText, setPlainText] = useState("");
  const [initialRichTextData, setInitialRichTextData] = useState("");
  const [initialPlainText, setInitialPlainText] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);
  const [explicitDeleteDraft, setExplicitDeleteDraft] = useState(false);

  const classes = useStyles();

  const history = useHistory();
  const match = useRouteMatch<{ _id: string }>();

  const { enqueueSnackbar } = useSnackbar();

  const { _id } = match.params;
  const isOnline = useNavigatorOnline();
  const { showErrorAlert } = useErrorAlert();

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

  const {
    loading: getDraftLoading,
    error: getDraftError,
    data: getDraftData,
    called: getDraftCalled
  } = useQuery(GET_DRAFT_BY_ID, {
    variables: { _id }
  });

  const [
    updateDraft,
    {
      loading: updateDraftLoading,
      error: updateDraftError,
      data: updateDraftData
    }
  ] = useMutation(UPDATE_DRAFT, {
    // The no-cache policy is because we have a debounced draft update that's being called many times,
    // and that will cause the cached draft to update,
    // which in turn causes this hook being called multiple times unnecessarily
    fetchPolicy: "no-cache"
  });

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

  // updateDraftError is handled by AutoSaveSpinner, so we don't have to show an error alert for it
  const error = createNewPostError || getDraftError || deleteDraftError;

  useEffect(() => {
    showErrorAlert(error);
  }, [error, showErrorAlert]);

  // Get draft from cache
  const client = useApolloClient();
  // Apollo client only caches *queries*, so we have to use readFragment.
  // This allows us to read cached draft data
  // even when user never called GET_DRAFT_BY_ID.
  const cachedDraftData = client.readFragment({
    id: `Draft:${_id}`,
    fragment: GET_CACHED_DRAFT_FRAGMENT
  });

  const alertAndRedirect = useCallback(
    (alertMessage: string, destination: string) => {
      enqueueSnackbar(alertMessage);
      setTimeout(() => {
        history.push(destination);
      }, 1000);
    },
    [enqueueSnackbar, history]
  );

  // Used after create post success,
  // or when user explicitly clicked "delete draft button".
  // We use the "isExplicit" parameter to differentiate between the two use cases
  const deleteOldDraft = useCallback(
    (isExplicit: boolean) => () => {
      deleteDraft({ variables: { _id } });
      setExplicitDeleteDraft(isExplicit);
    },
    [_id, deleteDraft]
  );

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

  // Use draft data to initialize our form
  useEffect(() => {
    if (getDraftCalled && getDraftData) {
      const { title, content, contentText, tagIds, thumbnailUrl } =
        getDraftData.getDraftById;
      setTitle(title);
      setRichTextData(content);
      setPlainText(contentText);
      setInitialRichTextData(content);
      setInitialPlainText(contentText);
      setSelectedTagIds(tagIds);
      setThumbnailUrl(thumbnailUrl ?? "");
    }
  }, [getDraftCalled, getDraftData, cachedDraftData]);

  useEffect(() => {
    // Offline, use cached draft data
    if (!isOnline && cachedDraftData) {
      console.log("Loaded draft from cache");
      const { title, content, contentText, tagIds } = cachedDraftData;
      setTitle(title);
      setRichTextData(content);
      setPlainText(contentText);
      setInitialRichTextData(content);
      setInitialPlainText(contentText);
      setSelectedTagIds(tagIds);
      setThumbnailUrl(thumbnailUrl);
    }
  }, [cachedDraftData, isOnline, thumbnailUrl]);

  // If user changed content, call debounced updateHandler to update draft
  useEffect(() => {
    // Update draft
    if (getDraftData) {
      if (title || plainText) {
        const { postId } = getDraftData.getDraftById;

        debouncedUpdateDraft({
          _id,
          postId,
          title,
          content: richTextData,
          contentText: plainText,
          tagIds: selectedTagIds,
          thumbnailUrl
        });
      }
    }
  }, [
    _id,
    title,
    plainText,
    selectedTagIds,
    getDraftData,
    debouncedUpdateDraft,
    thumbnailUrl,
    richTextData
  ]);

  // Create post success
  useEffect(() => {
    if (createNewPostCalled && createNewPostData) {
      // Delete draft after user successfully created post
      deleteOldDraft(false)();
      alertAndRedirect("Create post successful", "/");
    }
  }, [
    alertAndRedirect,
    createNewPostCalled,
    createNewPostData,
    deleteOldDraft
  ]);

  // Explicit delete draft success
  useEffect(() => {
    if (deleteDraftCalled && deleteDraftData && explicitDeleteDraft) {
      alertAndRedirect("Deleted draft", "/drafts");
    }
  }, [
    alertAndRedirect,
    deleteDraftCalled,
    deleteDraftData,
    explicitDeleteDraft
  ]);

  // Clear error messages when user enters text
  useEffect(() => {
    if (title) {
      setTitleErrorMessage("");
    }
  }, [title]);

  useEffect(() => {
    loadingVar(getDraftLoading);
  }, [getDraftLoading]);

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
      setShowCustomDialog(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCustomDialog(false);
    if (validate()) {
      createNewPost({
        variables: {
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

  const handleTagsChange = useCallback((tag: any) => {
    setSelectedTagIds(prevIds => {
      if (prevIds.includes(tag._id)) {
        return prevIds.filter(id => id !== tag._id);
      }
      return [...prevIds, tag._id];
    });
  }, []);

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
          onClick={deleteOldDraft(true)}
          disabled={deleteDraftLoading}
          variant="contained"
          color="secondary">
          Delete Draft
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
        dialogTitle="Create story?"
        open={showCustomDialog}
        handleClose={() => {
          setShowCustomDialog(false);
        }}
        isDisabled={false}
        formId="update-form"
        type="submit"
      />
    </Fragment>
  );
};

export default DraftUpdate;
