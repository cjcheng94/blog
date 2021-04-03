"use strict";
import React, {
  useState,
  useEffect,
  useCallback,
  useMemo,
  Fragment
} from "react";
import ToggleButton from "@material-ui/lab/ToggleButton";
import Divider from "@material-ui/core/Divider";
import { makeStyles } from "@material-ui/core";

import FormatBoldIcon from "@material-ui/icons/FormatBold";
import FormatItalicIcon from "@material-ui/icons/FormatItalic";
import FormatListNumberedIcon from "@material-ui/icons/FormatListNumbered";
import FormatListBulletedIcon from "@material-ui/icons/FormatListBulleted";
import FormatQuoteIcon from "@material-ui/icons/FormatQuote";
import FormatUnderlinedIcon from "@material-ui/icons/FormatUnderlined";
import ImageIcon from "@material-ui/icons/Image";
import InsertLinkIcon from "@material-ui/icons/InsertLink";
import FormatSizeIcon from "@material-ui/icons/FormatSize";

import {
  Editor,
  EditorState,
  RichUtils,
  ContentBlock,
  getDefaultKeyBinding,
  convertToRaw,
  AtomicBlockUtils,
  convertFromRaw
} from "draft-js";

import { MediaComponent } from "@components";

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
  },
  fileInput: {
    display: "none"
  }
}));

const getBlockStyle = (block: ContentBlock) => {
  switch (block.getType()) {
    case "blockquote":
      return "richEditorBlockQuote";
    default:
      return "";
  }
};

const preventDefault = (e: React.MouseEvent) => {
  e.preventDefault();
};

type StyleControlsProps = {
  editorState: EditorState;
  onToggle: (v: string) => void;
};

const BlockStyleControls: React.FC<StyleControlsProps> = ({
  editorState,
  onToggle
}) => {
  const selection = editorState.getSelection();
  const blockType = editorState
    .getCurrentContent()
    .getBlockForKey(selection.getStartKey())
    .getType();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formatType = e.currentTarget.value;

    // trigger input element when user clicks image button
    if (formatType === "image") {
      // !. Non-null assertion operator
      document.getElementById("imageInput")!.click();
      return;
    }

    if (formatType === "link") {
      return;
    }

    // trigger generic block types
    onToggle(formatType);
  };

  return (
    <Fragment>
      <ToggleButton
        size="small"
        value="header-two"
        aria-label="header-two"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "header-two"}
      >
        <FormatSizeIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="ordered-list-item"
        aria-label="ordered-list-item"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "ordered-list-item"}
      >
        <FormatListNumberedIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="unordered-list-item"
        aria-label="unordered-list-item"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "unordered-list-item"}
      >
        <FormatListBulletedIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="blockquote"
        aria-label="blockquote"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "blockquote"}
      >
        <FormatQuoteIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="image"
        aria-label="image"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "image"}
      >
        <ImageIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        disabled
        value="link"
        aria-label="link"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={blockType === "link"}
      >
        <InsertLinkIcon />
      </ToggleButton>
    </Fragment>
  );
};

const InlineStyleControls: React.FC<StyleControlsProps> = ({
  editorState,
  onToggle
}) => {
  const currentStyle = editorState.getCurrentInlineStyle();

  const handleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    onToggle(e.currentTarget.value);
  };

  return (
    <Fragment>
      <ToggleButton
        size="small"
        value="BOLD"
        aria-label="Bold"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={currentStyle.has("BOLD")}
      >
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="ITALIC"
        aria-label="Italic"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={currentStyle.has("ITALIC")}
      >
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="UNDERLINE"
        aria-label="Underline"
        onMouseDown={preventDefault}
        onClick={handleToggle}
        selected={currentStyle.has("UNDERLINE")}
      >
        <FormatUnderlinedIcon />
      </ToggleButton>
    </Fragment>
  );
};

type RichTextEditorProps = {
  onChange?: (value: string) => void;
  readOnly?: boolean;
  rawContent?: string;
};

const RichTextEditor: React.FC<RichTextEditorProps> = props => {
  const { onChange, readOnly, rawContent } = props;
  const editor = React.useRef<Editor>(null);
  const classes = useStyles();

  const initailEditorState = () => {
    if (rawContent) {
      // edit and preview existing content
      const contentStateFromRaw = convertFromRaw(JSON.parse(rawContent));
      const editorStateFromRaw = EditorState.createWithContent(
        contentStateFromRaw
      );
      return editorStateFromRaw;
    }
    // create new content
    return EditorState.createEmpty();
  };

  const [editorState, setEditorState] = useState<EditorState>(
    initailEditorState()
  );

  const memoizedEditorData = useMemo(
    () => JSON.stringify(convertToRaw(editorState.getCurrentContent())),
    [editorState]
  );

  useEffect(() => {
    onChange && onChange(memoizedEditorData);
  }, [memoizedEditorData]);

  const focusEditor = useCallback(() => {
    if (editor.current) {
      editor.current.focus();
    }
  }, [editor]);

  const handleKeyCommand = (command: string, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);
    if (newState) {
      setEditorState(newState);
      return "handled";
    }
    return "not-handled";
  };

  const mapKeyToEditorCommand = (e: React.KeyboardEvent) => {
    if (e.keyCode === 9 /* TAB */) {
      const newEditorState = RichUtils.onTab(e, editorState, 4 /* maxDepth */);
      if (newEditorState !== editorState) {
        setEditorState(newEditorState);
      }
      return null;
    }
    return getDefaultKeyBinding(e);
  };

  const toggleBlockType = (blockType: string) => {
    setEditorState(RichUtils.toggleBlockType(editorState, blockType));
  };

  const toggleInlineStyle = (inlineStyle: string) => {
    setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
  };

  // handle images
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();
    const handleImag = () => {
      const contentState = editorState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(
        "IMAGE",
        "IMMUTABLE",
        { src: reader.result }
      );
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newEditorState = EditorState.set(editorState, {
        currentContent: contentStateWithEntity
      });
      setEditorState(
        AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, " ")
      );
    };
    reader.addEventListener("load", handleImag);
    if (event.target.files) {
      reader.readAsDataURL(Array.from(event.target.files)[0]);
    }
  };

  const renderBlock = (contentBlock: ContentBlock) => {
    const blockType = contentBlock.getType();
    // render custom image component
    if (blockType === "atomic") {
      const entityKey = contentBlock.getEntityAt(0);
      const entityData = editorState
        .getCurrentContent()
        .getEntity(entityKey)
        .getData();
      return {
        component: MediaComponent,
        editable: false,
        props: { src: { file: entityData.src } }
      };
    }
    return;
  };

  // If the user changes block type before entering any text, we can
  // either style the placeholder or hide it. Let's just hide it now.
  let className = "RichEditor-editor";
  var contentState = editorState.getCurrentContent();
  if (!contentState.hasText()) {
    if (contentState.getBlockMap().first().getType() !== "unstyled") {
      className += " RichEditor-hidePlaceholder";
    }
  }

  return (
    <div>
      {!readOnly && (
        <div className={classes.controls}>
          <InlineStyleControls
            editorState={editorState}
            onToggle={toggleInlineStyle}
          />
          <Divider
            flexItem
            orientation="vertical"
            className={classes.divider}
          />
          <BlockStyleControls
            editorState={editorState}
            onToggle={toggleBlockType}
          />
        </div>
      )}

      <div className={className} onClick={focusEditor}>
        <Editor
          blockStyleFn={getBlockStyle}
          blockRendererFn={renderBlock}
          editorState={editorState}
          handleKeyCommand={handleKeyCommand}
          keyBindingFn={mapKeyToEditorCommand}
          onChange={setEditorState}
          placeholder="Tell a story..."
          ref={editor}
          readOnly={readOnly}
          spellCheck={true}
        />
      </div>
      <input
        id="imageInput"
        className={classes.fileInput}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/gif"
        onChange={handleImageUpload}
      />
    </div>
  );
};

export default RichTextEditor;
