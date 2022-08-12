import React, { useState, useCallback, useMemo } from "react";
import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { ToolbarPlugin, InitialStatePlugin, EditorTheme } from "@components";
import "./style.css";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

type EditorProps = {
  propOnChange: (value: string) => void;
};

const Editor: React.FC<EditorProps> = props => {
  const { propOnChange } = props;

  const onChange = useCallback((editorState: any) => {
    propOnChange(JSON.stringify(editorState));
  }, []);

  const initialConfig = {
    namespace: "MyEditor",
    theme: EditorTheme,
    onError
  };

  return (
    <div className="myEditor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
        />
        <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <InitialStatePlugin />
      </LexicalComposer>
    </div>
  );
};

export default Editor;
