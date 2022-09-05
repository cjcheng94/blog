import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { $createParagraphNode, $createTextNode, $getRoot } from "lexical";
const InitialStatePlugin = ({
  data,
  initialPlainText,
  setShowLegacyAlert
}: {
  data?: string;
  initialPlainText?: string;
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

  return null;
};

export default InitialStatePlugin;
