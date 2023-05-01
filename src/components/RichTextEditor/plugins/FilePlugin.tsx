import { useEffect } from "react";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { exportFile, importFile } from "@lexical/file";

export default function FilePlugin({
  filename,
  promptDownload,
  promptImport,
  downloadCallback,
  importCallback
}: {
  filename?: string;
  promptDownload?: boolean;
  promptImport?: boolean;
  downloadCallback?: () => void;
  importCallback?: () => void;
}) {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (promptDownload && filename) {
      exportFile(editor, {
        fileName: `${filename} ${new Date().toISOString()}`
      });

      downloadCallback && downloadCallback();
    }
  }, [downloadCallback, promptDownload, editor, filename]);

  useEffect(() => {
    if (promptImport) {
      importFile(editor);

      importCallback && importCallback();
    }
  }, [editor, importCallback, promptImport]);

  return null;
}
