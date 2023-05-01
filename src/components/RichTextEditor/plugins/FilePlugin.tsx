import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { exportFile } from "@lexical/file";

export default function FilePlugin({
  filename,
  promptDownload,
  downloadCallback
}: {
  filename: string | undefined;
  promptDownload: boolean | undefined;
  downloadCallback: (() => void) | undefined;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (promptDownload && filename && downloadCallback) {
      exportFile(editor, {
        fileName: `${filename} ${new Date().toISOString()}`
      });

      downloadCallback();
    }
  }, [downloadCallback, promptDownload, editor, filename]);


  return null;
}
