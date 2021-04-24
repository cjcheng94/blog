"use strict";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { makeStyles } from "@material-ui/core";
import {
  Editor,
  EditorState,
  ContentState,
  RichUtils,
  ContentBlock,
  getDefaultKeyBinding,
  convertToRaw,
  AtomicBlockUtils,
  convertFromRaw,
  CompositeDecorator
} from "draft-js";
import { MediaComponent, LinkComponent, RichTextControls } from "@components";

const useStyles = makeStyles(theme => ({
  fileInput: {
    display: "none"
  },
  editor: {
    minHeight: 500
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

const findLinkEntities = (
  contentBlock: ContentBlock,
  callback: (start: number, end: number) => void,
  contentState: ContentState
) => {
  contentBlock.findEntityRanges(character => {
    const entityKey = character.getEntity();
    return (
      entityKey !== null &&
      contentState.getEntity(entityKey).getType() === "LINK"
    );
  }, callback);
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
    const compositeDecorator = new CompositeDecorator([
      {
        strategy: findLinkEntities,
        component: LinkComponent
      }
    ]);
    if (rawContent) {
      // edit and preview existing content
      const contentStateFromRaw = convertFromRaw(JSON.parse(rawContent));
      const editorStateFromRaw = EditorState.createWithContent(
        contentStateFromRaw,
        compositeDecorator
      );
      return editorStateFromRaw;
    }
    // create new content
    return EditorState.createEmpty(compositeDecorator);
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

  const toggleStyle = (type: "inline" | "block") => {
    if (type === "block") {
      return (blockType: string) => {
        setEditorState(RichUtils.toggleBlockType(editorState, blockType));
      };
    }
    return (inlineStyle: string) => {
      setEditorState(RichUtils.toggleInlineStyle(editorState, inlineStyle));
    };
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

  // create links
  const insertLink = (url: string) => {
    const contentState = editorState.getCurrentContent();
    const contentStateWithEntity = contentState.createEntity(
      "LINK",
      "MUTABLE",
      { url }
    );
    const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
    const newEditorState = EditorState.set(editorState, {
      currentContent: contentStateWithEntity
    });
    setEditorState(
      RichUtils.toggleLink(
        newEditorState,
        newEditorState.getSelection(),
        entityKey
      )
    );
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (!selection.isCollapsed()) {
      setEditorState(RichUtils.toggleLink(editorState, selection, null));
    }
  };

  // Render image with custom MediaComponent
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

  return (
    <div>
      {!readOnly && (
        <RichTextControls
          editorState={editorState}
          onToggle={toggleStyle}
          insertLink={insertLink}
          removeLink={removeLink}
        />
      )}
      <div className={classes.editor} onClick={focusEditor}>
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
