import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
const InitialStatePlugin = ({
  data,
  initialPlainText,
  setShowLegacyAlert,
  allowInitialStateChange,
  initialStateChangeCallback
}: {
  data?: string;
  initialPlainText?: string;
  allowInitialStateChange?: boolean;
  initialStateChangeCallback?: () => void;
  setShowLegacyAlert: (show: boolean) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (data) {
      // Prevent legacy Draft editor state crash
      try {
        const editorState = editor.parseEditorState(data);
        editor.setEditorState(editorState);
      } catch (err) {
        setShowLegacyAlert(true);
        editor.update(() => {
          const paragraph = $createParagraphNode();
          const text = $createTextNode(initialPlainText);
          paragraph.append(text);
          $getRoot().append(paragraph);
        });
      }
    }
  }, []);

  useEffect(() => {
    // When applying changes from draft, allow a one-time initial state change from PostUpdate
    // this prevents a possible circular state update
    if (allowInitialStateChange && initialStateChangeCallback && data) {
      const editorState = editor.parseEditorState(data);
      editor.setEditorState(editorState);
      initialStateChangeCallback();
    }
  }, [allowInitialStateChange, initialStateChangeCallback, data]);

  return null;
};

export default InitialStatePlugin;
