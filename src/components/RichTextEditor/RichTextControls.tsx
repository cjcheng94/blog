import React, { useState } from "react";
import { EditorState, getVisibleSelectionRect } from "draft-js";

import ToggleButton from "@material-ui/lab/ToggleButton";
import TextField from "@material-ui/core/TextField";
import Divider from "@material-ui/core/Divider";
import InputAdornment from "@material-ui/core/InputAdornment";
import IconButton from "@material-ui/core/IconButton";
import Box from "@material-ui/core/Box";
import { makeStyles } from "@material-ui/core";

import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import ImageIcon from "@material-ui/icons/Image";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import LinkOffIcon from "@material-ui/icons/LinkOff";
import FormatSizeIcon from "@material-ui/icons/FormatSize";
import Check from "@material-ui/icons/Check";

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
    display: "inline-flex",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "4px",
    "& button": {
      border: "none",
      margin: "4px"
    }
  },
  divider: {
    margin: theme.spacing(1, 0.5)
  }
}));

const RichTextControls: React.FC<RichTextControlsProps> = ({
  editorState,
  onToggle,
  insertLink,
  removeLink
}) => {
  const [showLinkEditor, setShowLinkEditor] = useState<boolean>(false);
  const [anchorURL, setAnchorURL] = useState<string>("");
  const classes = useStyles();

  const [selectionRect, setSelectionRect] = React.useState<{
    left: number;
    width: number;
    right: number;
    top: number;
    bottom: number;
    height: number;
  }>({ left: 0, width: 0, right: 0, top: 0, bottom: 0, height: 0 });

  React.useEffect(() => {
    if (getVisibleSelectionRect(window) !== null) {
      setSelectionRect(getVisibleSelectionRect(window));
    }
  }, [editorState]);

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
      insertLinkAndHideInput;
    }
    if (e.key === "Escape") {
      setAnchorURL("");
      setShowLinkEditor(false);
    }
  };

  return (
    <div className={classes.controls}>
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
        <Box
          style={{
            position: "absolute",
            top: selectionRect.top,
            left: selectionRect.right + 12,
            zIndex: 999
          }}
        >
          <TextField
            autoFocus
            size="small"
            variant="outlined"
            value={anchorURL}
            onChange={e => setAnchorURL(e.target.value)}
            onKeyDown={handleLinkKeyDown}
            placeholder="https://"
            InputProps={{
              endAdornment: (
                <InputAdornment position="start">
                  <IconButton onClick={insertLinkAndHideInput}>
                    <Check />
                  </IconButton>
                </InputAdornment>
              )
            }}
          />
        </Box>
      )}
    </div>
  );
};

export default RichTextControls;
