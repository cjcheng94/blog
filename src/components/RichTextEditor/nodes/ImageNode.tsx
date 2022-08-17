/**
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

import type {
  DOMConversionMap,
  DOMConversionOutput,
  DOMExportOutput,
  EditorConfig,
  GridSelection,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SerializedEditor,
  SerializedLexicalNode,
  Spread
} from "lexical";

import "./ImageNode.css";

// import {useCollaborationContext} from '@lexical/react/LexicalCollaborationContext';
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { LinkPlugin } from "@lexical/react/LexicalLinkPlugin";
import { LexicalNestedComposer } from "@lexical/react/LexicalNestedComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { TablePlugin } from "@lexical/react/LexicalTablePlugin";
import { useLexicalNodeSelection } from "@lexical/react/useLexicalNodeSelection";
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
import { useCallback, useEffect, useRef, useState } from "react";

import useGetImageUrl from "../../../utils/useGetImageUrl";
import useUploadImage from "../../../utils/useUploadImage";
import { imageMapVar } from "../../../api/cache";

export interface ImagePayload {
  altText: string;
  caption?: LexicalEditor;
  height?: number;
  key?: NodeKey;
  maxWidth?: number | string;
  showCaption?: boolean;
  id: string;
  width?: number | string;
}

function convertImageElement(domNode: Node): null | DOMConversionOutput {
  if (domNode instanceof HTMLImageElement) {
    const { alt: altText, id } = domNode;
    const node = $createImageNode({ altText, id });
    return { node };
  }
  return null;
}

function RemoteImage({
  altText,
  imageRef,
  id,
  width,
  height,
  maxWidth
}: {
  altText: string;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number | string;
  id: string;
  width: "inherit" | number | string;
}): JSX.Element {
  const { loading, failed, data: imgUrl } = useGetImageUrl(id);

  if (loading) return <div>LOADING</div>;

  if (failed) return <div>ERROR</div>;

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
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
  return <div></div>;
}

function LocalImage({
  altText,
  imageRef,
  id,
  width,
  height,
  maxWidth
}: {
  altText: string;
  height: "inherit" | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number | string;
  id: string;
  width: "inherit" | number | string;
}): JSX.Element {
  const imgMap = imageMapVar();
  const imgArrayBuffer = imgMap[id];

  const {
    loading,
    failed,
    data: imgUrl
  } = useUploadImage({
    fileId: id,
    file: imgArrayBuffer
  });

  if (loading) return <div>UPLOADING</div>;

  if (failed) return <div>ERROR</div>;

  if (imgUrl) {
    return (
      <img
        src={imgUrl}
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
  return <div></div>;
}

function ImageComponent({
  id,
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
  id: string;
  width: "inherit" | number | string;
}): JSX.Element {
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  // const {isCollabActive} = useCollaborationContext();
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

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
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        payload => {
          const event = payload;

          if (isResizing) {
            return true;
          }
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
  }, [
    clearSelection,
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    setSelected
  ]);

  const setShowCaption = () => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) {
        node.setShowCaption(true);
      }
    });
  };

  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = $isNodeSelection(selection) && (isSelected || isResizing);

  // There is such an ID in the imgMap object, which means this image was
  // just added by the user, and dosen't yet exist on the backend
  const imgMap = imageMapVar();
  const isLocal = Object.keys(imgMap).includes(id);

  return (
    <>
      <div draggable={draggable}>
        {isLocal ? (
          <LocalImage
            id={id}
            altText={altText}
            imageRef={ref}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
        ) : (
          <RemoteImage
            id={id}
            altText={altText}
            imageRef={ref}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
        )}
      </div>
      {showCaption && (
        <div className="image-caption-container">
          <LexicalNestedComposer initialEditor={caption}>
            <LinkPlugin />
            <RichTextPlugin
              contentEditable={<div className="ImageNode__contentEditable" />}
              placeholder={
                <span className="ImageNode__placeholder">
                  Enter a caption...
                </span>
              }
              // TODO Remove after it's inherited from the parent (LexicalComposer)
              initialEditorState={null}
            />
          </LexicalNestedComposer>
        </div>
      )}
    </>
  );
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption: SerializedEditor;
    height?: number;
    maxWidth: number | string;
    showCaption: boolean;
    id: string;
    width?: number | string;
    type: "image";
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  __id: string;
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
      node.__id,
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
    const { altText, height, width, maxWidth, caption, id, showCaption } =
      serializedNode;
    const node = $createImageNode({
      altText,
      height,
      maxWidth,
      showCaption,
      id,
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
    element.setAttribute("id", this.__id);
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
    id: string,
    altText: string,
    maxWidth: number | string,
    width?: "inherit" | number | string,
    height?: "inherit" | number,
    showCaption?: boolean,
    caption?: LexicalEditor,
    key?: NodeKey
  ) {
    super(key);
    this.__id = id;
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
      id: this.getId(),
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

  getId(): string {
    return this.__id;
  }

  getAltText(): string {
    return this.__altText;
  }

  decorate(): JSX.Element {
    return (
      <ImageComponent
        id={this.__id}
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
  id,
  width,
  showCaption,
  caption,
  key
}: ImagePayload): ImageNode {
  return new ImageNode(
    id,
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
