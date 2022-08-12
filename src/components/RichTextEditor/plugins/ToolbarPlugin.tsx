import React, { useState, useEffect, useCallback } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister } from "@lexical/utils";
import {
  // $createParagraphNode,
  // $createTextNode,
  // $getNodeByKey,
  // $getRoot,
  $getSelection,
  $isRangeSelection,
  // $isTextNode,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  // COMMAND_PRIORITY_CRITICAL,
  // COMMAND_PRIORITY_LOW,
  // ElementNode,
  // FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  // INDENT_CONTENT_COMMAND,
  // NodeKey,
  // OUTDENT_CONTENT_COMMAND,
  // REDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  // TextNode,
  UNDO_COMMAND
} from "lexical";
import { makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  active: {
    color: "blue"
  }
}));
const LowPriority = 1;

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [activeEditor, setActiveEditor] = useState(editor);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const classes = useStyles();

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      })
      // editor.registerCommand(
      //   SELECTION_CHANGE_COMMAND,
      //   (_payload, newEditor) => {
      //     updateToolbar();
      //     return false;
      //   },
      //   LowPriority
      // ),
      // editor.registerCommand(
      //   CAN_UNDO_COMMAND,
      //   payload => {
      //     setCanUndo(payload);
      //     return false;
      //   },
      //   LowPriority
      // ),
      // editor.registerCommand(
      //   CAN_REDO_COMMAND,
      //   payload => {
      //     setCanRedo(payload);
      //     return false;
      //   },
      //   LowPriority
      // )
    );
  }, [editor, updateToolbar]);

  return (
    <div>
      <button
        onClick={() => {
          activeEditor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
        }}
        className={isBold ? classes.active : ""}
        title="Bold (⌘B)"
        aria-label={`Format text as bold. Shortcut: ${"⌘B"}`}
      >
        B
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
        }}
        aria-label="Format Italics"
      >
        I
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
        }}
        aria-label="Format Underline"
      >
        U
      </button>
      <button
        onClick={() => {
          editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
        }}
        aria-label="Format Strikethrough"
      >
        S
      </button>
    </div>
  );
};

export default ToolbarPlugin;
