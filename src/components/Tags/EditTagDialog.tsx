import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Slide,
  IconButton,
  CircularProgress
} from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import { Label, Delete } from "@mui/icons-material";
import { TransitionProps } from "@mui/material/transitions";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_TAGS, DELETE_TAG, CREATE_TAG } from "../../api/gqlDocuments";
import { ErrorAlert, NewTagInput } from "@components";
import { Tag } from "PostTypes";

const Transition = React.forwardRef(function Transition(
  props: TransitionProps & { children: React.ReactElement<any, any> },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const useStyles = makeStyles(theme => ({
  dialog: {
    width: 300
  },
  content: {
    maxHeight: 250
  },
  tagsContainer: {
    marginTop: 4
  },
  tagRow: {
    display: "flex",
    alignItems: "center",
    marginBottom: 4
  },
  iconButton: {
    padding: 4,
    marginRight: 4,
    color: theme.palette.error.dark,
    "&.Mui-disabled": {
      color: theme.palette.primary.dark
    }
  }
}));

interface Props {
  open: boolean;
  handleClose: () => void;
}
const EditTagDialog: React.FC<Props> = ({ open, handleClose }) => {
  const [hoveredTag, setHoveredTag] = useState<string>("");
  const classes = useStyles();

  // Get all tags
  const {
    data,
    loading: getAllTagsLoading,
    error: getAllTagsError
  } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  // Create-tag gql mutation
  const [createTag, { loading: createTagLoading, error: createTagError }] =
    useMutation(CREATE_TAG, {
      refetchQueries: [{ query: GET_ALL_TAGS }]
    });

  // Delete tag mutation
  const [deleteTag, { loading: deleteTagLoading, error: deleteTagError }] =
    useMutation(DELETE_TAG, {
      refetchQueries: [{ query: GET_ALL_TAGS }]
    });

  const handleDelete = (tagId: string) => () => {
    deleteTag({
      variables: {
        tagId
      }
    });
  };

  const handleCreateTag = (tagName: string) => {
    if (tagName.length < 1) {
      return;
    }
    createTag({ variables: { name: tagName } });
  };

  const renderError = () => {
    const currentError = getAllTagsError || createTagError || deleteTagError;
    if (!currentError) {
      return;
    }
    return <ErrorAlert error={currentError} />;
  };

  const renderTags = () => {
    // Show Progress spinner when data is not ready
    if (getAllTagsLoading || !data?.tags) {
      return <CircularProgress size={24} />;
    }
    // Render tags
    const { tags } = data;
    return tags.map(tag => {
      if (!tag) return;
      const isHovered = hoveredTag === tag._id;

      return (
        <div
          key={tag._id}
          className={classes.tagRow}
          onMouseEnter={() => {
            setHoveredTag(tag._id);
          }}
          onMouseLeave={() => {
            setHoveredTag("");
          }}
        >
          <IconButton
            title="Delete"
            aria-haspopup="true"
            color="inherit"
            disabled={!isHovered || deleteTagLoading}
            className={classes.iconButton}
            onClick={handleDelete(tag._id)}
            size="large"
          >
            {isHovered ? <Delete /> : <Label />}
          </IconButton>
          <div>{tag.name}</div>
        </div>
      );
    });
  };

  return (
    <div>
      {renderError()}
      <Dialog
        open={open}
        onClose={handleClose}
        TransitionComponent={Transition}
        classes={{ paperScrollPaper: classes.dialog }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle id="alert-dialog-slide-title">Edit Tags</DialogTitle>
        <DialogContent className={classes.content}>
          <NewTagInput
            placeholder="Add tag"
            onSubmit={handleCreateTag}
            loading={createTagLoading}
          />
          <div className={classes.tagsContainer}>{renderTags()}</div>
        </DialogContent>
        <DialogActions style={{ justifyContent: "space-evenly" }}>
          <Button onClick={handleClose} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default EditTagDialog;
