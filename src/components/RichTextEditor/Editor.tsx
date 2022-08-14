import React, { useState, useCallback, useMemo } from "react";
import { $getRoot, $getSelection } from "lexical";
import { useEffect } from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";

import {
  ToolbarPlugin,
  InitialStatePlugin,
  EditorTheme,
  CodeHighlightPlugin
} from "@components";
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
    onError,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode
    ]
  };

  return (
    <div className="myEditor">
      <LexicalComposer initialConfig={initialConfig}>
        <ToolbarPlugin />
        <RichTextPlugin
          contentEditable={<ContentEditable />}
          placeholder={<div>Enter some text...</div>}
        />
        <CodeHighlightPlugin />
        <ListPlugin />
        <LinkPlugin />
        <OnChangePlugin onChange={onChange} ignoreSelectionChange={true} />
        <HistoryPlugin />
        <AutoFocusPlugin />
        <InitialStatePlugin />
      </LexicalComposer>
    </div>
  );
};

export default Editor;
