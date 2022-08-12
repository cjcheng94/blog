import { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

const InitialStatePlugin = () => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const getData = async () => {
      const res = await fetch("http://localhost:3000/temp.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json"
        }
      });
      const data = await res.json();
      const editorState = editor.parseEditorState(data);
      editor.setEditorState(editorState);
    };
    getData();
  }, []);

  return null;
};

export default InitialStatePlugin;
