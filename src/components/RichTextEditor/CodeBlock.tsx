import React, { useState, useEffect } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  ClickAwayListener,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => {
  return {
    container: {
      borderRadius: 4,
      boxShadow:
        "0px 2px 1px -1px rgb(0 0 0 / 20%), 0px 1px 1px 0px rgb(0 0 0 / 14%), 0px 1px 3px 0px rgb(0 0 0 / 12%)"
    },
    prismContainer: {
      borderRadius: 4,
      padding: 8,
      overflow: "auto"
    },
    textFieldContainer: {
      width: "100%",
      padding: 8
    },
    textField: {
      "& textarea": {
        width: "calc(100% + 8px)",
        marginRight: -8
      }
    },
    actions: {
      padding: 8
    },
    select: {
      marginRight: 8
    }
  };
});

type Language = "javascript" | "typescript" | "jsx" | "tsx" | "json" | "css";

const CodeBlock = (props: any) => {
  const [textValue, setTextValue] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [language, setLanguage] = useState<Language>("jsx");
  const classes = useStyles();
  const { block, blockProps, contentState } = props;

  // Start edit mode on mount
  useEffect(() => {
    startEdit();
  }, []);

  // Get initial value provided by parent
  const getValue = (field: string) =>
    contentState.getEntity(block.getEntityAt(0)).getData()[field];

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);
  };

  const changeLanguage = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value;
    setLanguage(value as Language);
  };

  const startEdit = () => {
    if (blockProps.readOnly) {
      setLanguage(getValue("language") || "javascript");
      return;
    }
    if (editMode) {
      return;
    }
    setEditMode(true);
    setTextValue(getValue("content"));
    setLanguage(getValue("language") || "javascript");
    blockProps.onStartEdit(block.getKey());
  };

  const finishEdit = () => {
    if (!editMode) {
      return;
    }
    const entityKey = block.getEntityAt(0);
    const newContentState = contentState.mergeEntityData(entityKey, {
      content: textValue,
      language
    });
    setEditMode(false);
    blockProps.onFinishEdit(block.getKey(), newContentState);
  };

  let textContent = "";
  if (editMode) {
    textContent = textValue;
  } else {
    textContent = getValue("content");
  }

  const PrismBlock = ({ code }: { code: string }) => {
    return (
      <Highlight
        {...defaultProps}
        theme={theme}
        code={code}
        language={language}
      >
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={className + " " + classes.prismContainer}
            style={style}
          >
            {tokens.map((line, i) => (
              <div {...getLineProps({ line, key: i })}>
                {line.map((token, key) => (
                  <span {...getTokenProps({ token, key })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    );
  };

  const languages: {
    name: string;
    value: Language;
  }[] = [
    {
      name: "JavaScript",
      value: "javascript"
    },
    {
      name: "TypeScript",
      value: "typescript"
    },
    {
      name: "JSX",
      value: "jsx"
    },
    {
      name: "TSX",
      value: "tsx"
    },
    {
      name: "JSON",
      value: "json"
    },
    {
      name: "CSS",
      value: "css"
    }
  ];

  return (
    <ClickAwayListener onClickAway={finishEdit}>
      <div className={classes.container}>
        <div onClick={startEdit}>
          <PrismBlock code={textContent || ""} />
        </div>
        {editMode && (
          <>
            <div className={classes.textFieldContainer}>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Enter code here"
                onChange={handleTextChange}
                value={textContent}
                onFocus={startEdit}
                classes={{ root: classes.textField }}
              />
            </div>
            <div className={classes.actions}>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={language}
                onChange={changeLanguage}
                className={classes.select}
                MenuProps={{ disablePortal: true }}
              >
                {languages.map(({ name, value }) => (
                  <MenuItem key={name} value={value}>
                    {name}
                  </MenuItem>
                ))}
              </Select>
            </div>
          </>
        )}
      </div>
    </ClickAwayListener>
  );
};

export default CodeBlock;
