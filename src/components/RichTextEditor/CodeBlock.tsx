import React, { useState, useEffect } from "react";
import Highlight, { defaultProps } from "prism-react-renderer";
import theme from "prism-react-renderer/themes/nightOwl";
import {
  Button,
  TextField,
  Select,
  MenuItem,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => {
  return {
    container: {},
    prismContainer: {
      borderRadius: 4,
      padding: 8,
      overflow: "auto"
    },
    editor: {
      width: "100%"
    },
    select: {
      marginRight: 8
    }
  };
});

type Language = "javascript" | "typescript" | "jsx" | "tsx";

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
  const getValue = () => {
    return contentState.getEntity(block.getEntityAt(0)).getData()["content"];
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setTextValue(value);
  };

  const changeLanguage = (e: React.ChangeEvent<{ value: unknown }>) => {
    const value = e.target.value;
    setLanguage(value as Language);
  };

  const startEdit = () => {
    if (editMode || blockProps.readOnly) {
      return;
    }
    setEditMode(true);
    setTextValue(getValue());
    blockProps.onStartEdit(block.getKey());
  };

  const finishEdit = () => {
    const entityKey = block.getEntityAt(0);
    const newContentState = contentState.mergeEntityData(entityKey, {
      content: textValue
    });
    setEditMode(false);
    blockProps.onFinishEdit(block.getKey(), newContentState);
  };

  let textContent = "";
  if (editMode) {
    textContent = textValue;
  } else {
    textContent = getValue();
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

  return (
    <div className={classes.container}>
      <div onClick={startEdit}>
        <PrismBlock code={textContent || ""} />
      </div>
      {editMode && (
        <>
          <TextField
            label="Enter code here"
            multiline
            //autoFocus
            rows={4}
            className={classes.editor}
            onChange={handleTextChange}
            value={textContent}
            onFocus={startEdit}
          />
          <div>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={language}
              onChange={changeLanguage}
              className={classes.select}
            >
              <MenuItem value="javascript">javascript</MenuItem>
              <MenuItem value="typescript">typescript</MenuItem>
              <MenuItem value="jsx">jsx</MenuItem>
              <MenuItem value="tsx">tsx</MenuItem>
            </Select>
            <Button color="primary" onClick={finishEdit}>
              Done
            </Button>
          </div>
        </>
      )}
    </div>
  );
};

export default CodeBlock;
