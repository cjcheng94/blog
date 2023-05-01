import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { exportFile } from "@lexical/file";

export default function FilePlugin({
  filename,
  downloadFile,
  downloadCallback
}: {
  filename: string | undefined;
  downloadFile: boolean | undefined;
  downloadCallback: (() => void) | undefined;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (downloadFile && filename && downloadCallback) {
      exportFile(editor, {
        fileName: `${filename} ${new Date().toISOString()}`
      });

      downloadCallback();
    }
  }, [downloadCallback, downloadFile, editor, filename]);

  return null;
}
