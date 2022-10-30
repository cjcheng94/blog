import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useInitialEffect } from "@utils";

const IsLegacyDataPlugin = ({
  initialContent,
  setShowLegacyAlert
}: {
  initialContent?: string;
  setShowLegacyAlert: (show: boolean) => void;
}) => {
  const [editor] = useLexicalComposerContext();

  // Try to parse data as lexical editor state,
  // if it fails, show a legacy data alert
  useInitialEffect(() => {
    if (initialContent) {
      try {
        editor.parseEditorState(initialContent);
      } catch (err) {
        setShowLegacyAlert(true);
      }
    }
  });

  return null;
};

export default IsLegacyDataPlugin;
