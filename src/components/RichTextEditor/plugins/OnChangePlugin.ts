import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useEffect } from "react";
import { $getRoot, $isParagraphNode } from "lexical";

type OnChangePluginProps = {
  ignoreInitialChange?: boolean;
  ignoreSelectionChange?: boolean;
  setContentEmpty?: (isEmpty: boolean) => void;
  onRichTextChange?: (data: string) => void;
  onTextContentChange?: (data: string) => void;
};

const OnChangePlugin = ({
  ignoreInitialChange = true,
  ignoreSelectionChange = false,
  setContentEmpty,
  onRichTextChange,
  onTextContentChange
}: OnChangePluginProps) => {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (setContentEmpty) {
      return editor.registerUpdateListener(() => {
        editor.getEditorState().read(() => {
          const root = $getRoot();
          const children = root.getChildren();

          if (children.length > 1) {
            setContentEmpty(false);
          } else {
            if ($isParagraphNode(children[0])) {
              const paragraphChildren = children[0].getChildren();
              setContentEmpty(paragraphChildren.length === 0);
            } else {
              setContentEmpty(false);
            }
          }
        });
      });
    }
  }, [editor, setContentEmpty]);

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
  }, [editor, ignoreInitialChange, ignoreSelectionChange, onRichTextChange]);

  useEffect(() => {
    if (onTextContentChange) {
      return editor.registerTextContentListener(textContent => {
        onTextContentChange(textContent);
      });
    }
  }, [editor, onTextContentChange]);

  return null;
};

export default OnChangePlugin;
