import React, {
  useState,
  useEffect,
  useCallback,
  Fragment,
  FormEvent
} from "react";
import { useMutation, useReactiveVar } from "@apollo/client";
import { Link, useHistory } from "react-router-dom";
import {
  TextField,
  Button,
  Typography,
  FormHelperText,
  IconButton
} from "@mui/material";
import { Close } from "@mui/icons-material";
import makeStyles from "@mui/styles/makeStyles";
import { useSnackbar } from "notistack";

import debounce from "lodash/debounce";

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
  draftErrorVar,
  isAuthedVar
} from "../api/cache";
import useCleanup from "../utils/useCleanup";
import { uploadImage } from "../api/imgur";

const useStyles = makeStyles(theme => ({
  formNew: {
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

const showAccountDialog = (type: "login" | "signup") => {
  accountDialogTypeVar(type);
};

const PostNew = () => {
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [title, setTitle] = useState("");
  const [richData, setRichData] = useState("");
  const [plainText, setPlainText] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [contentEmpty, setContentEmpty] = useState(true);
  const [titleErrorMessage, setTitleErrorMessage] = useState("");
  const [contentErrorMessage, setContentErrorMessage] = useState("");
  const [selectedTagIds, setSelectedTagIds] = useState<string[]>([]);

  const history = useHistory();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

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
  const isAuthenticated = useReactiveVar(isAuthedVar);
  // Id of newly created draft
  const createdDraftId = createDraftData?.createDraft?._id;

  type DraftVariables = {
    _id: string;
    title: string;
    content: string;
    contentText: string;
    thumbnailUrl: string;
    tagIds: string[];
  };
  const updateDraftHandler = (draftVariables: DraftVariables) => {
    updateDraft({
      variables: draftVariables
    });
  };

  // Debounce update draft mutation
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedUpdateDraft = useCallback(
    debounce(updateDraftHandler, 1000 * 5),
    []
  );

  useEffect(() => {
    if (!isAuthenticated) {
      return;
    }

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
      // call debounced updateHandler w/ the id from newly created draft to update it
      debouncedUpdateDraft({
        _id: createdDraftId,
        title,
        thumbnailUrl,
        content: richData,
        contentText: plainText,
        tagIds: selectedTagIds
      });
    }
  }, [
    title,
    plainText,
    richData,
    selectedTagIds,
    isAuthenticated,
    createDraftCalled,
    createdDraftId,
    debouncedUpdateDraft,
    createDraftLoading,
    createDraft,
    thumbnailUrl
  ]);

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

      const exploreMessage = (
        <div>
          <div>
            As this is a personal blog, I have disabled new user registration,
          </div>
          <div>but you can still explore the editor 😉</div>
        </div>
      );

      const exploreSnackbarAction = (snackbarId: string) => (
        <>
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={() => closeSnackbar(snackbarId)}
          >
            <Close />
          </IconButton>
        </>
      );

      enqueueSnackbar(exploreMessage, {
        key: "exploreSnackbar",
        action: exploreSnackbarAction,
        autoHideDuration: 7 * 1000
      });
    }
    return () => {
      closeSnackbar("exploreSnackbar");
    };
  }, [closeSnackbar, enqueueSnackbar, isAuthenticated]);

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
      enqueueSnackbar("Create new post successfull");
      setTimeout(() => history.push("/"), 1000);
    }
  }, [
    createNewPostCalled,
    createNewPostData,
    createdDraftId,
    deleteDraft,
    enqueueSnackbar,
    history
  ]);

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
          thumbnailUrl,
          content: richData,
          contentText: plainText,
          tagIds: selectedTagIds
        }
      });
    }
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
          variant="standard"
          margin="normal"
          type="text"
          label="title"
          className={classes.title}
          value={title}
          onChange={e => {
            setTitle(e.target.value);
          }}
          helperText={titleErrorMessage}
          error={!!titleErrorMessage}
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
    </Fragment>
  );
};

export default PostNew;
