import React, { useState } from "react";
import { TextField, IconButton, makeStyles } from "@material-ui/core";
import { Check, Close } from "@material-ui/icons";

const useStyles = makeStyles(theme => ({
  wrapper: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    overflow: "hidden"
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
    maxWidth: 212,
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
  placeholder: {
    width: "100%",
    whiteSpace: "pre",
    cursor: "pointer"
  }
}));

type TagRowProps = {
  placeholder?: string;
  loading?: boolean;
  onSubmit: (tagName: string) => void;
};

const NewTagInput: React.FC<TagRowProps> = ({
  placeholder,
  loading,
  onSubmit
}) => {
  const [showInput, setShowInout] = useState<boolean>(false);
  const [newTagName, setNewTagName] = useState<string>("Add tag");
  const classes = useStyles();

  // Show/hide new tag input when clicking on toggle button
  const tagContainerClass = showInput
    ? `${classes.newTagContainer} ${classes.shownNewTagContainer}`
    : classes.newTagContainer;

  // Transform toggle button between x <-> +
  const addTagButtonClass = showInput
    ? `${classes.newTagButton} ${classes.transformedNewTagButton}`
    : classes.newTagButton;

  return (
    <div className={classes.wrapper}>
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
          disabled={loading || !showInput}
          onClick={() => {
            onSubmit(newTagName);
          }}
        >
          <Check />
        </IconButton>
      </div>
      {placeholder && !showInput && (
        <div
          className={classes.placeholder}
          onClick={() => {
            setShowInout(prevShow => !prevShow);
          }}
        >
          {placeholder}
        </div>
      )}
    </div>
  );
};

export default NewTagInput;
