import React from "react";
import {
  LexicalEditor,
  $createParagraphNode,
  $createTextNode,
  $getRoot
} from "lexical";
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

import {
  SharedHistoryContext,
  useSharedHistoryContext
} from "./context/SharedHistoryContext";
import { ImageNode } from "./nodes/ImageNode";
import {
  ToolbarPlugin,
  IsLegacyDataPlugin,
  EditorTheme,
  CodeHighlightPlugin,
  OnChangePlugin
} from "@components";
import "./style.css";
import "./prism-night-owl.css";
import { useReactiveVar } from "@apollo/client";
import { darkModeVar } from "../../api/cache";

// Catch any errors that occur during Lexical updates and log them
// or throw them as needed. If you don't throw them, Lexical will
// try to recover gracefully without losing user data.
function onError(error: any) {
  console.error(error);
}

type EditorProps = {
  editable?: boolean;
  initialContent?: string;
  initialPlainText?: string;
  setContentEmpty?: (isEmpty: boolean) => void;
  onTextContentChange?: (data: string) => void;
  onRichTextTextChange?: (data: string) => void;
};

const Editor: React.FC<EditorProps> = props => {
  const {
    editable = true,
    initialContent,
    initialPlainText,
    setContentEmpty,
    onTextContentChange,
    onRichTextTextChange
  } = props;

  const { historyState } = useSharedHistoryContext();

  const isDarkMode = useReactiveVar(darkModeVar);

  const initializeEditor = (editor: LexicalEditor) => {
    try {
      // Parse initial rich text data (stringified editorState)
      if (initialContent) {
        const editorState = editor.parseEditorState(initialContent);
        editor.setEditorState(editorState);
      }
    } catch (err) {
      // Failed to parse as rich text, populate editor with plain text instead (legacy data)
      if (initialPlainText) {
        editor.update(() => {
          const paragraph = $createParagraphNode();
          const text = $createTextNode(initialPlainText);
          paragraph.append(text);
          $getRoot().append(paragraph);
        });
      }
    }
  };

  const initialConfig = {
    namespace: "MyEditor",
    theme: EditorTheme,
    onError,
    editable,
    editorState: initializeEditor,
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

  const darkModeClass = isDarkMode ? "dark-mode-editor" : "";

  return (
    <div className={`myEditor ${darkModeClass}`}>
      <LexicalComposer initialConfig={initialConfig}>
        <SharedHistoryContext>
          {editable && <ToolbarPlugin />}
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
          <IsLegacyDataPlugin initialContent={initialContent} />
          <ImagesPlugin />
        </SharedHistoryContext>
      </LexicalComposer>
    </div>
  );
};

export default React.memo(Editor);
