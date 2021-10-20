import React, { useState } from "react";
import {
  Chip,
  TextField,
  CircularProgress,
  IconButton,
  makeStyles
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";
import { useQuery, useMutation } from "@apollo/client";
import { GET_ALL_TAGS, CREATE_TAG } from "../gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing(0.5)
  },
  newTagContainer: {
    display: "flex",
    flexShrink: 0,
    height: 32,

    maxWidth: 0,
    opacity: 0,
    transformOrigin: "left",
    transition:
      "opacity 187ms cubic-bezier(0.4, 0, 0.2, 1) 0ms, max-width 125ms cubic-bezier(0.4, 0, 0.2, 1) 62ms"
  },
  shownNewTagContainer: {
    maxWidth: 150,
    opacity: 1
  },
  tagInput: {
    marginRight: theme.spacing(1),
    "& input": {
      boxSizing: "border-box",
      height: 32
    }
  },
  tagButtons: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1)
  },
  newTagButton: {
    width: 32,
    height: 32,
    marginRight: theme.spacing(1),
    transform: "rotate(45deg)",
    transition: "transform cubic-bezier(0.4, 0, 0.2, 1) 62ms"
  },
  transformedNewTagButton: {
    transform: "rotate(0)"
  },
  tags: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(1)
  }
}));

type TagRowProps = {
  onChange?: (tag: Tag) => void;
  selectedTagIds?: string[];
};

const TagRow: React.FC<TagRowProps> = ({ onChange, selectedTagIds }) => {
  const [showInput, setShowInout] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>("Add tag");
  const classes = useStyles();

  // Get all tags
  const { data, loading: getAllTagsLoading } =
    useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  // Create-tag gql mutation
  const [createTag, { loading: createTagLoading }] = useMutation(CREATE_TAG, {
    refetchQueries: [{ query: GET_ALL_TAGS }]
  });

  // Trigger onChange function from parent
  const handleTagChange = (tag: Tag) => () => {
    if (onChange) {
      return onChange(tag);
    }
  };

  const isSelected = (id: string) => {
    if (!selectedTagIds) {
      return false;
    }
    return selectedTagIds.includes(id);
  };

  // Call create-tag gql mutation
  const handleCreateTag = () => {
    if (newTagName.length < 1) {
      return;
    }
    createTag({
      variables: { name: newTagName }
    });
  };

  // Render tags when network call completes, otherwise render a circular progress
  const renderTags = () => {
    if (getAllTagsLoading || !data || !data.tags) {
      return <CircularProgress size={24} />;
    }

    const { tags } = data;

    return tags.map(
      tag =>
        tag && (
          <Chip
            clickable
            size="small"
            key={tag._id}
            label={tag.name}
            className={classes.tags}
            color={isSelected(tag._id) ? "primary" : "default"}
            variant={isSelected(tag._id) ? "default" : "outlined"}
            onClick={handleTagChange(tag)}
          />
        )
    );
  };

  // Show/hide new tag input when clicking on toggle button
  const tagContainerClass = showInput
    ? `${classes.newTagContainer} ${classes.shownNewTagContainer}`
    : classes.newTagContainer;

  // Transform toggle button between x <-> +
  const addTagButtonClass = showInput
    ? `${classes.newTagButton} ${classes.transformedNewTagButton}`
    : classes.newTagButton;

  return (
    <div className={classes.container}>
      <IconButton
        color="primary"
        aria-label="toggle new tag input"
        className={addTagButtonClass}
        onClick={() => {
          setShowInout(prevShow => !prevShow);
        }}
      >
        <Close />
      </IconButton>
      <div className={tagContainerClass}>
        <TextField
          variant="outlined"
          size="small"
          className={classes.tagInput}
          value={newTagName}
          onChange={e => {
            setNewTagName(e.target.value);
          }}
          onFocus={() => {
            setNewTagName("");
          }}
        />
        <IconButton
          color="primary"
          aria-label="add tag"
          className={classes.tagButtons}
          onClick={handleCreateTag}
        >
          <Check />
        </IconButton>
      </div>
      {renderTags()}
      {createTagLoading && <CircularProgress size={18} />}
    </div>
  );
};

export default TagRow;
