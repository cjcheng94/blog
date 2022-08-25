import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";

type OnChangePluginProps = {
  ignoreInitialChange?: boolean;
  ignoreSelectionChange?: boolean;
  onRichTextChange?: (data: string) => void;
  onTextContentChange?: (data: string) => void;
};

const OnChangePlugin = ({
  ignoreInitialChange = true,
  ignoreSelectionChange = false,
  onRichTextChange,
  onTextContentChange
}: OnChangePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (onRichTextChange) {
      return editor.registerUpdateListener(
        ({ editorState, dirtyElements, dirtyLeaves, prevEditorState }) => {
          if (
            ignoreSelectionChange &&
            dirtyElements.size === 0 &&
            dirtyLeaves.size === 0
          ) {
            return;
          }

          if (ignoreInitialChange && prevEditorState.isEmpty()) {
            return;
          }

          const serializedRichText = JSON.stringify(editorState);
          onRichTextChange(serializedRichText);
        }
      );
    }
  }, [editor]);

  useEffect(() => {
    if (onTextContentChange) {
      return editor.registerTextContentListener(textContent => {
        onTextContentChange(textContent);
      });
    }
  }, [editor]);

  return null;
};

export default OnChangePlugin;
