import React, { useEffect } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useInitialEffect } from "@utils";
import { useSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import { Close } from "@mui/icons-material";

const IsLegacyDataPlugin = ({
  initialContent
}: {
  initialContent?: string;
}) => {
  const [editor] = useLexicalComposerContext();
  const editorKey = editor.getKey();

  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  useEffect(() => {
    return () => {
      closeSnackbar(editorKey);
    };
  }, [closeSnackbar, editorKey]);

  const snackBarMessage = (
    <div>
      <div>This article was written in a legacy editor</div>
      <div>We can only display the text content at the moment</div>
    </div>
  );

  const action = (snackBarId: string) => (
    <IconButton
      size="small"
      aria-label="close"
      color="inherit"
      onClick={() => closeSnackbar(snackBarId)}>
      <Close />
    </IconButton>
  );

  // Try to parse data as lexical editor state,
  // if it fails, show a legacy data alert
  useInitialEffect(() => {
    if (initialContent) {
      try {
        editor.parseEditorState(initialContent);
      } catch (err) {
        enqueueSnackbar(snackBarMessage, {
          key: editorKey,
          action,
          autoHideDuration: null
        });
      }
    }
  });

  return null;
};

export default IsLegacyDataPlugin;
