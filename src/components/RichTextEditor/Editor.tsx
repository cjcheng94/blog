import React from "react";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { AutoFocusPlugin } from "@lexical/react/LexicalAutoFocusPlugin";
import ImagesPlugin from "./plugins/ImagePlugin";

import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { ListPlugin } from "@lexical/react/LexicalListPlugin";
import { HeadingNode, QuoteNode } from "@lexical/rich-text";
import { ListItemNode, ListNode } from "@lexical/list";
import { CodeHighlightNode, CodeNode } from "@lexical/code";
import { AutoLinkNode, LinkNode } from "@lexical/link";
import { useSharedHistoryContext } from "./context/SharedHistoryContext";
import { ImageNode } from "./nodes/ImageNode";
import {
  ToolbarPlugin,
  InitialStatePlugin,
  EditorTheme,
  CodeHighlightPlugin,
  OnChangePlugin
} from "@components";
import "./style.css";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

type EditorProps = {
  readOnly?: boolean;
  initialState?: string;
  setContentEmpty?: (isEmpty: boolean) => void;
  onTextContentChange?: (data: string) => void;
  onRichTextTextChange?: (data: string) => void;
};

const Editor: React.FC<EditorProps> = props => {
  const {
    readOnly = false,
    initialState,
    setContentEmpty,
    onTextContentChange,
    onRichTextTextChange
  } = props;

  const { historyState } = useSharedHistoryContext();

  const initialConfig = {
    namespace: "MyEditor",
    theme: EditorTheme,
    onError,
    readOnly,
    nodes: [
      HeadingNode,
      ListNode,
      ListItemNode,
      QuoteNode,
      CodeNode,
      CodeHighlightNode,
      AutoLinkNode,
      LinkNode,
      ImageNode
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
        <OnChangePlugin
          ignoreSelectionChange={true}
          setContentEmpty={setContentEmpty}
          onRichTextChange={onRichTextTextChange}
          onTextContentChange={onTextContentChange}
        />
        <HistoryPlugin externalHistoryState={historyState} />
        <AutoFocusPlugin />
        <InitialStatePlugin data={initialState} />
        <ImagesPlugin />
      </LexicalComposer>
    </div>
  );
};

export default Editor;
