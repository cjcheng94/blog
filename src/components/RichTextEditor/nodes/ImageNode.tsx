import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedEditor,
  SerializedLexicalNode,
  Spread
} from "lexical";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
import LexicalErrorBoundary from "@lexical/react/LexicalErrorBoundary";
import { mergeRegister } from "@lexical/utils";
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  createEditor,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND
} from "lexical";
import * as React from "react";
import { useCallback, useEffect, useRef, Suspense } from "react";

import { useSharedHistoryContext } from "../context/SharedHistoryContext";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  contentEditable: {
    color: theme.palette.text.secondary,
    minHeight: 20,
    border: 0,
    resize: "none",
    cursor: "text",
    caretColor: "rgb(5, 5, 5)",
    display: "block",
    position: "relative",
    tabSize: 1,
    outline: 0,
    paddingTop: 4,
    userSelect: "text",
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
    whiteSpace: "pre-wrap",
    wordBreak: "break-word"
  },
  placeholder: {
    color: theme.palette.text.secondary,
    overflow: "hidden",
    position: "absolute",
    textOverflow: "ellipsis",
    top: 4,
    left: 0,
    userSelect: "none",
    whiteSpace: "nowrap",
    display: "inline-block",
    pointerEvents: "none",
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: "0.03333em"
  },
  captionContainer: {
    position: "relative"
  },
  addCaptionButton: {
    color: theme.palette.text.secondary,
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: "0.03333em",
    cursor: "pointer"
  }
}));

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  maxWidth?: number | string;
  showCaption?: boolean;
  src: string;
  width?: number | string;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, src } = domNode;
    const node = $createImageNode({ altText, src });
    return { node };
  }
  return null;
}
const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    throw new Promise(resolve => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  imageRef,
  src,
  width,
  height,
  maxWidth
}: {
  altText: string;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number | string;
  src: string;
  width: "inherit" | number | string;
}): JSX.Element {
  useSuspenseImage(src);
  return (
    <img
      src={src}
      alt={altText}
      ref={imageRef}
      style={{
        height,
        maxWidth,
        width
      }}
      draggable="false"
    />
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  showCaption,
  caption
}: {
  altText: string;
  caption: LexicalEditor;
  height: "inherit" | number;
  maxWidth: number | string;
  nodeKey: NodeKey;
  showCaption: boolean;
  src: string;
  width: "inherit" | number | string;
}): JSX.Element {
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);

  const [editor] = useLexicalComposerContext();

  const classes = useStyles();

  const parentEditorEditable = editor.isEditable();

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) {
          node.remove();
        }
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected]
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        payload => {
          const event = payload;
          if (event.target === ref.current) {
            if (!event.shiftKey) {
              clearSelection();
            }
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW
      )
    );
  }, [clearSelection, editor, isSelected, nodeKey, onDelete, setSelected]);

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const { historyState } = useSharedHistoryContext();

  return (
    <Suspense fallback={null}>
      <div>
        <LazyImage
          src={src}
          altText={altText}
          imageRef={ref}
          width={width}
          height={height}
          maxWidth={maxWidth}
        />
        {showCaption ? (
          <div className={classes.captionContainer}>
            <LexicalNestedComposer initialEditor={caption}>
              <LinkPlugin />
              <HistoryPlugin externalHistoryState={historyState} />
              <RichTextPlugin
                contentEditable={
                  <ContentEditable className={classes.contentEditable} />
                }
                placeholder={
                  parentEditorEditable ? (
                    <span className={classes.placeholder}>
                      Enter a caption...
                    </span>
                  ) : null
                }
                ErrorBoundary={LexicalErrorBoundary}
              />
            </LexicalNestedComposer>
          </div>
        ) : (
          parentEditorEditable && (
            <span className={classes.addCaptionButton} onClick={setShowCaption}>
              add caption
            </span>
          )
        )}
      </div>
    </Suspense>
  );
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number | string;
    showCaption: boolean;
    src: string;
    width?: number | string;
    type: "image";
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __src: string;
  __altText: string;
  __width: "inherit" | number | string;
  __height: "inherit" | number;
  __maxWidth: number | string;
  __showCaption: boolean;
  __caption: LexicalEditor;

  static getType(): string {
    return "image";
  }

  static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__showCaption,
      node.__caption,
      node.__key
    );
  }

  static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, caption, src, showCaption } =
      serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      src,
      width
    });
    const nestedEditor = node.__caption;
    const editorState = nestedEditor.parseEditorState(caption.editorState);
    if (!editorState.isEmpty()) {
      nestedEditor.setEditorState(editorState);
    }
    return node;
  }

  exportDOM(): DOMExportOutput {
    const element = document.createElement("img");
    element.setAttribute("src", this.__src);
    element.setAttribute("alt", this.__altText);
    return { element };
  }

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => ({
        conversion: convertImageElement,
        priority: 0
      })
    };
  }

  constructor(
    src: string,
    altText: string,
    maxWidth: number | string,
    width?: "inherit" | number | string,
    height?: "inherit" | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || "inherit" || "100%";
    this.__height = height || "inherit";
    this.__showCaption = showCaption || false;
    this.__caption = caption || createEditor();
  }

  exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption.toJSON(),
      height: this.__height === "inherit" ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      showCaption: this.__showCaption,
      src: this.getSrc(),
      type: "image",
      version: 1,
      width: this.__width === "inherit" ? 0 : "100%"
    };
  }

  setWidthAndHeight(
    width: "inherit" | number,
    height: "inherit" | number
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  setShowCaption(showCaption: boolean): void {
    const writable = this.getWritable();
    writable.__showCaption = showCaption;
  }

  // View

  createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement("span");
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  updateDOM(): false {
    return false;
  }

  getSrc(): string {
    return this.__src;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        showCaption={this.__showCaption}
        caption={this.__caption}
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = "100%",
  src,
  width,
  showCaption,
  caption,
  key
}: ImagePayload): ImageNode {
  return new ImageNode(
    src,
    altText,
    maxWidth,
    width,
    height,
    showCaption,
    caption,
    key
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined
): node is ImageNode {
  return node instanceof ImageNode;
}
