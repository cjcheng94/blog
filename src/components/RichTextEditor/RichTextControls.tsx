import React, { useState, useEffect, useRef } from "react";
import { EditorState } from "draft-js";
import ToggleButton from "@material-ui/lab/ToggleButton";
import {
  makeStyles,
  TextField,
  Divider,
  InputAdornment,
  IconButton,
  Paper
} from "@material-ui/core";
import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  FormatQuote as FormatQuoteIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Image as ImageIcon,
  InsertLink as InsertLinkIcon,
  LinkOff as LinkOffIcon,
  FormatSize as FormatSizeIcon,
  Check as CheckIcon
} from "@material-ui/icons";

interface RichTextControlsProps {
  editorState: EditorState;
  onToggle: (type: "inline" | "block") => (v: string) => void;
  insertLink: (url: string) => void;
  removeLink: () => void;
}

const preventDefault = (e: React.MouseEvent) => {
  e.preventDefault();
};

const useStyles = makeStyles(theme => ({
  controls: {
    position: "sticky",
    top: "72px",
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "4px",
    "& button": {
      border: "none",
      margin: "4px"
    },
    "& .MuiToggleButton-root.Mui-selected + .MuiToggleButton-root.Mui-selected":
      {
        margin: "4px"
      },
    [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
      top: "56px"
    },
    [theme.breakpoints.up("sm")]: {
      top: "72px"
    }
  },
  divider: {
    margin: theme.spacing(1, 0.5)
  },
  linkEditor: {
    "& .MuiInputBase-adornedEnd": {
      paddingRight: 0
    }
  }
}));

const UseoutsideClickHandler = (
  ref: React.RefObject<HTMLDivElement>,
  handler: () => void
) => {
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handler();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
};

const RichTextControls: React.FC<RichTextControlsProps> = ({
  editorState,
  onToggle,
  insertLink,
  removeLink
}) => {
  const [showLinkEditor, setShowLinkEditor] = useState<boolean>(false);
  const [anchorURL, setAnchorURL] = useState<string>("");
  const classes = useStyles();
  const linkEditorRef = useRef<HTMLDivElement>(null);

  UseoutsideClickHandler(linkEditorRef, () => {
    setShowLinkEditor(false);
    setAnchorURL("");
  });

  // Handle block controls
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const getLinkKey = () => {
    const contentState = editorState.getCurrentContent();
    const startKey = editorState.getSelection().getStartKey();
    const startOffset = editorState.getSelection().getStartOffset();
    const blockWithLinkAtBeginning = contentState.getBlockForKey(startKey);
    const linkKey = blockWithLinkAtBeginning.getEntityAt(startOffset);
    return linkKey;
  };

  const handleBlockStyleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formatType = e.currentTarget.value;
    // trigger input element when user clicks image button
    if (formatType === "image") {
      // !. Non-null assertion operator
      document.getElementById("imageInput")!.click();
      return;
    }

    if (formatType === "link") {
      // prompt link editor and provide initial value for it if there is any
      const selection = editorState.getSelection();
      const contentState = editorState.getCurrentContent();
      if (!selection.isCollapsed()) {
        const linkKey = getLinkKey();
        let url = "";
        if (linkKey) {
          const linkInstance = contentState.getEntity(linkKey);
          url = linkInstance.getData().url;
        }
        setShowLinkEditor(true);
        setAnchorURL(url);
      }
      return;
    }

    if (formatType === "removeLink") {
      removeLink();
      return;
    }

    // trigger generic block types
    onToggle("block")(formatType);
  };

  // Handle inline styles
  const currentStyle = editorState.getCurrentInlineStyle();

  const handleInlineStyleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle("inline")(e.currentTarget.value);
  };

  // Handle link
  const insertLinkAndHideInput = () => {
    insertLink(anchorURL);
    setShowLinkEditor(false);
  };

  const handleLinkKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      insertLinkAndHideInput();
    }
    if (e.key === "Escape") {
      e.preventDefault();
      setAnchorURL("");
      setShowLinkEditor(false);
    }
  };

  return (
    <Paper className={classes.controls}>
      {/* Inline style controls */}
      <ToggleButton
        size="small"
        value="BOLD"
        aria-label="Bold"
        onMouseDown={preventDefault}
        onClick={handleInlineStyleToggle}
        selected={currentStyle.has("BOLD")}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="ITALIC"
        aria-label="Italic"
        onMouseDown={preventDefault}
        onClick={handleInlineStyleToggle}
        selected={currentStyle.has("ITALIC")}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="UNDERLINE"
        aria-label="Underline"
        onMouseDown={preventDefault}
        onClick={handleInlineStyleToggle}
        selected={currentStyle.has("UNDERLINE")}
      >
        <FormatUnderlinedIcon />
      </ToggleButton>
      {/* Block style controls */}
      <Divider flexItem orientation="vertical" className={classes.divider} />
      <ToggleButton
        size="small"
        value="header-two"
        aria-label="header-two"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "header-two"}
      >
        <FormatSizeIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="ordered-list-item"
        aria-label="ordered-list-item"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "ordered-list-item"}
      >
        <FormatListNumberedIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="unordered-list-item"
        aria-label="unordered-list-item"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "unordered-list-item"}
      >
        <FormatListBulletedIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="blockquote"
        aria-label="blockquote"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "blockquote"}
      >
        <FormatQuoteIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="image"
        aria-label="image"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "image"}
      >
        <ImageIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="link"
        aria-label="link"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        selected={blockType === "link"}
        disabled={editorState.getSelection().isCollapsed()}
      >
        <InsertLinkIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="removeLink"
        aria-label="remove link"
        onMouseDown={preventDefault}
        onClick={handleBlockStyleToggle}
        disabled={!getLinkKey()}
      >
        <LinkOffIcon />
      </ToggleButton>
      {showLinkEditor && (
        <div ref={linkEditorRef}>
          <TextField
            autoFocus
            size="small"
            variant="outlined"
            value={anchorURL}
            className={classes.linkEditor}
            onChange={e => setAnchorURL(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="https://"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={insertLinkAndHideInput}>
                    <CheckIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </div>
      )}
    </Paper>
  );
};

export default RichTextControls;
