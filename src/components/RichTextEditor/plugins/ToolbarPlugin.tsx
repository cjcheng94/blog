import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { mergeRegister, $getNearestNodeOfType } from "@lexical/utils";
import {
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  COMMAND_PRIORITY_CRITICAL,
  COMMAND_PRIORITY_LOW,
  $createParagraphNode,
  $getNodeByKey,
  $getSelection,
  $isRangeSelection,
  RangeSelection,
  LexicalEditor,
  GridSelection,
  NodeSelection
} from "lexical";
import { $wrapLeafNodesInElements, $isAtNodeEnd } from "@lexical/selection";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode
} from "@lexical/rich-text";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode
} from "@lexical/list";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages
} from "@lexical/code";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";

import { INSERT_IMAGE_COMMAND } from "./ImagePlugin";
import type { InsertImagePayload } from "./ImagePlugin";

import {
  FormatBold as FormatBoldIcon,
  FormatItalic as FormatItalicIcon,
  FormatListNumbered as FormatListNumberedIcon,
  FormatListBulleted as FormatListBulletedIcon,
  StrikethroughS as StrikethroughSIcon,
  FormatQuote as FormatQuoteIcon,
  FormatUnderlined as FormatUnderlinedIcon,
  Image as ImageIcon,
  InsertLink as InsertLinkIcon,
  LinkOff as LinkOffIcon,
  Check as CheckIcon,
  Code as CodeIcon,
  Subject as SubjectIcon,
  Title as TitleIcon,
  Undo as UndoIcon,
  Redo as RedoIcon
} from "@material-ui/icons";
import {
  makeStyles,
  withStyles,
  Button,
  Divider,
  Paper,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Select,
  TextField,
  InputAdornment,
  IconButton
} from "@material-ui/core";
import ToggleButton from "@material-ui/lab/ToggleButton";

const useStyles = makeStyles(theme => ({
  controls: {
    height: 46,
    position: "sticky",
    top: "72px",
    display: "inline-flex",
    alignItems: "center",
    flexWrap: "wrap",
    maxWidth: "100%",
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: "4px",
    zIndex: 1,
    marginBottom: theme.spacing(1),
    "& button": {
      border: "none",
      margin: "4px",
      color: theme.palette.text.secondary
    },
    "& .MuiToggleButton-root.Mui-selected + .MuiToggleButton-root.Mui-selected":
      {
        margin: "4px"
      },
    [`${theme.breakpoints.up("xs")} and (orientation: landscape)`]: {
      top: "56px"
    },
    [theme.breakpoints.up("sm")]: {
      top: "72px"
    }
  },
  divider: {
    margin: theme.spacing(1, 0.5)
  },
  linkEditor: {
    "& .MuiInputBase-adornedEnd": {
      paddingRight: 0
    }
  },
  menuButton: {
    textTransform: "none"
  },
  languageSelect: {
    margin: "0 8px",
    ...theme.typography.button,
    color: theme.palette.text.secondary,
    textTransform: "none"
  },
  invisibleInput: {
    display: "none"
  }
}));

const preventDefault = (e: React.MouseEvent) => {
  e.preventDefault();
};

const StyledListItemIcon = withStyles({
  root: {
    minWidth: 32
  }
})(ListItemIcon);

const blockTypeMap = {
  paragraph: { name: "Normal", icon: <SubjectIcon /> },
  h1: { name: "Large Heading", icon: <TitleIcon /> },
  h2: { name: "Small Heading", icon: <TitleIcon /> },
  ol: { name: "Numbered List", icon: <FormatListNumberedIcon /> },
  ul: { name: "Bulleted List", icon: <FormatListBulletedIcon /> },
  quote: { name: "Quote", icon: <FormatQuoteIcon /> },
  code: { name: "Code Block", icon: <CodeIcon /> }
};

type FormatType = "bold" | "italic" | "underline" | "strikethrough" | "code";
type BlockType = "paragraph" | "h1" | "h2" | "ul" | "ol" | "quote" | "code";
type EditorOptionsMenuProps = {
  editor: any;
  blockType: BlockType;
};

const BlockOptionsMenu: React.FC<EditorOptionsMenuProps> = ({
  editor,
  blockType
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const classes = useStyles();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createParagraphNode());
        }
      });
    }
    handleClose();
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    handleClose();
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    handleClose();
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    handleClose();
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    handleClose();
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createQuoteNode());
        }
      });
    }
    handleClose();
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapLeafNodesInElements(selection, () => $createCodeNode());
        }
      });
    }
    handleClose();
  };

  return (
    <div>
      <Button
        className={classes.menuButton}
        aria-controls="block-type-menu"
        aria-haspopup="true"
        onClick={handleClick}
        startIcon={blockTypeMap[blockType].icon}
      >
        {blockTypeMap[blockType].name}
      </Button>
      <Menu
        id="block-options-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={formatParagraph}>
          <StyledListItemIcon>
            <SubjectIcon />
          </StyledListItemIcon>
          <ListItemText>Normal</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatLargeHeading}>
          <StyledListItemIcon>
            <TitleIcon />
          </StyledListItemIcon>
          <ListItemText>Large Heading</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatSmallHeading}>
          <StyledListItemIcon>
            <TitleIcon fontSize="small" />
          </StyledListItemIcon>
          <ListItemText>Small Heading</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatBulletList}>
          <StyledListItemIcon>
            <FormatListBulletedIcon />
          </StyledListItemIcon>
          <ListItemText>Bullet List</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatNumberedList}>
          <StyledListItemIcon>
            <FormatListNumberedIcon />
          </StyledListItemIcon>
          <ListItemText>Numbered List</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatQuote}>
          <StyledListItemIcon>
            <FormatQuoteIcon />
          </StyledListItemIcon>
          <ListItemText>Quote</ListItemText>
        </MenuItem>
        <MenuItem onClick={formatCode}>
          <StyledListItemIcon>
            <CodeIcon />
          </StyledListItemIcon>
          <ListItemText>Code</ListItemText>
        </MenuItem>
      </Menu>
    </div>
  );
};

const getSelectedNode = (selection: RangeSelection) => {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
};

const LinkEditor = ({ editor }: { editor: LexicalEditor }) => {
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(true);
  const [lastSelection, setLastSelection] = useState<
    RangeSelection | GridSelection | NodeSelection | null
  >(null);
  const classes = useStyles();

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const activeElement = document.activeElement;
    if (selection !== null) {
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      setLastSelection(null);
      setLinkUrl("");
      setEditMode(false);
    }
    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        COMMAND_PRIORITY_LOW
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  const insertLink = () => {
    editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
  };

  const handleLinkKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (lastSelection !== null) {
        if (linkUrl !== "") {
          insertLink();
        }
        setEditMode(false);
      }
    } else if (event.key === "Escape") {
      event.preventDefault();
      setEditMode(false);
    }
  };

  return (
    <div className="link-editor">
      {isEditMode && (
        <TextField
          size="small"
          variant="outlined"
          value={linkUrl}
          className={classes.linkEditor}
          onChange={e => setLinkUrl(e.target.value)}
          onKeyDown={handleLinkKeyDown}
          placeholder="https://"
          InputProps={{
            endAdornment: (
              <InputAdornment position="start">
                <IconButton onClick={insertLink}>
                  <CheckIcon />
                </IconButton>
              </InputAdornment>
            )
          }}
        />
      )}
    </div>
  );
};

const ToolbarPlugin = () => {
  const [editor] = useLexicalComposerContext();
  const [blockType, setBlockType] = useState<BlockType>("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState("");
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  const classes = useStyles();

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList
            ? (parentList.getTag() as BlockType)
            : (element.getTag() as BlockType);
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? (element.getTag() as BlockType)
            : (element.getType() as BlockType);

          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }

      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        payload => {
          setCanUndo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        payload => {
          setCanRedo(payload);
          return false;
        },
        COMMAND_PRIORITY_CRITICAL
      )
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => getCodeLanguages(), []);
  const onCodeLanguageSelect = useCallback(
    e => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const handleInlineStyleToggle = (e: React.MouseEvent<HTMLButtonElement>) => {
    const formatType = e.currentTarget.value as FormatType;
    editor.dispatchCommand(FORMAT_TEXT_COMMAND, formatType);
  };

  const handleUndo = () => {
    editor.dispatchCommand(UNDO_COMMAND, undefined);
  };
  const handleRedo = () => {
    editor.dispatchCommand(REDO_COMMAND, undefined);
  };

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const uploadImage = () => {
    document.getElementById("imageInput")!.click();
  };

  const insertImage = useCallback(
    (payload: InsertImagePayload) => {
      editor.dispatchCommand(INSERT_IMAGE_COMMAND, payload);
    },
    [editor]
  );

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reader = new FileReader();

    const handleImage = () => {
      if (typeof reader.result !== "string") {
        return;
      }
      insertImage({
        altText: "",
        src: reader.result
      });
    };

    reader.addEventListener("load", handleImage);

    if (event.target.files) {
      const file = event.target.files[0];

      // File size limit of 5 MB
      if (file.size > 5 * 1024 * 1024) {
        console.log("File size exceeded 5MB limit");
      } else {
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <Paper className={classes.controls}>
      <ToggleButton
        size="small"
        value="undo"
        aria-label="Undo"
        onMouseDown={preventDefault}
        onClick={handleUndo}
        disabled={!canUndo}
      >
        <UndoIcon />
      </ToggleButton>
      <ToggleButton
        size="small"
        value="redo"
        aria-label="Redo"
        onMouseDown={preventDefault}
        onClick={handleRedo}
        disabled={!canRedo}
      >
        <RedoIcon />
      </ToggleButton>

      <Divider flexItem orientation="vertical" className={classes.divider} />

      <BlockOptionsMenu editor={editor} blockType={blockType} />

      <Divider flexItem orientation="vertical" className={classes.divider} />

      {blockType === "code" ? (
        <Select
          value={codeLanguage}
          onChange={onCodeLanguageSelect}
          className={classes.languageSelect}
          disableUnderline
        >
          {codeLanguges.map(language => (
            <MenuItem key={language} value={language}>
              {language}
            </MenuItem>
          ))}
          <MenuItem key={"typescript"} value="typescript">
            typescript
          </MenuItem>
        </Select>
      ) : (
        <>
          <ToggleButton
            size="small"
            value="bold"
            aria-label="Bold"
            onMouseDown={preventDefault}
            onClick={handleInlineStyleToggle}
            selected={isBold}
          >
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            value="italic"
            aria-label="Italic"
            onMouseDown={preventDefault}
            onClick={handleInlineStyleToggle}
            selected={isItalic}
          >
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            value="underline"
            aria-label="Underline"
            onMouseDown={preventDefault}
            onClick={handleInlineStyleToggle}
            selected={isUnderline}
          >
            <FormatUnderlinedIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            value="strikethrough"
            aria-label="Strikethrough"
            onMouseDown={preventDefault}
            onClick={handleInlineStyleToggle}
            selected={isStrikethrough}
          >
            <StrikethroughSIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            value="code"
            aria-label="Code"
            onMouseDown={preventDefault}
            onClick={handleInlineStyleToggle}
            selected={isCode}
          >
            <CodeIcon />
          </ToggleButton>

          <Divider
            flexItem
            orientation="vertical"
            className={classes.divider}
          />

          <ToggleButton
            size="small"
            value="image"
            aria-label="Image"
            onMouseDown={preventDefault}
            onClick={uploadImage}
          >
            <ImageIcon />
          </ToggleButton>
          <ToggleButton
            size="small"
            value="link"
            aria-label="link"
            onMouseDown={preventDefault}
            onClick={insertLink}
            selected={isLink}
          >
            <InsertLinkIcon />
          </ToggleButton>
          {isLink && <LinkEditor editor={editor} />}
          <input
            id="imageInput"
            type="file"
            accept="image/*"
            className={classes.invisibleInput}
            onChange={handleImageUpload}
          />
        </>
      )}
    </Paper>
  );
};

export default ToolbarPlugin;