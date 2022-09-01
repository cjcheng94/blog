import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const InitialStatePlugin = ({ data }: { data?: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (data) {
      // Prevent legacy Draft editor state crash
      try {
        const editorState = editor.parseEditorState(data);
        editor.setEditorState(editorState);
      } catch (err) {}
    }
  }, []);

  return null;
};

export default InitialStatePlugin;
