import React, { useState } from "react";
import {
  Chip,
  TextField,
  CircularProgress,
  IconButton,
  makeStyles
} from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";

import { useQuery } from "@apollo/client";
import { GET_ALL_TAGS } from "../gqlDocuments";
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
  const { data, loading } = useQuery(GET_ALL_TAGS);
  const classes = useStyles();

  if (loading) {
    return <CircularProgress />;
  }

  const { tags } = data;

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
          defaultValue="Add tag"
          variant="outlined"
          size="small"
          className={classes.tagInput}
        />
        <IconButton
          color="primary"
          aria-label="add tag"
          className={classes.tagButtons}
        >
          <Check />
        </IconButton>
      </div>
      {tags.map((tag: Tag) => (
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
      ))}
    </div>
  );
};

export default TagRow;
