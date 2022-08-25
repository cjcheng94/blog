import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const InitialStatePlugin = ({ data }: { data?: string }) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (data) {
      const editorState = editor.parseEditorState(data);
      editor.setEditorState(editorState);
    }
  }, []);

  return null;
};

export default InitialStatePlugin;
