import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.type === "dark";
  return {
    fileInput: {
      display: "none"
    },
    editor: {
      minHeight: 500,
      cursor: "text",
      fontSize: "1.2em",
      marginTop: 10,

      "& .public-DraftEditorPlaceholder-root, & .public-DraftEditor-content": {
        margin: "0 -15px -15px",
        padding: 15
      },
      "& .public-DraftEditor-content": {
        minHeight: 100
      },
      "& .RichEditor-blockquote": {
        borderLeft: "5px solid #eee",
        color: isDarkTheme ? "#ddd" : "#666",
        fontFamily: '"Hoefler Text", "Georgia", serif',
        fontStyle: "italic",
        fontSize: "1.4em",
        margin: "16px 0",
        padding: "10px 20px"
      }
    }
  };
});

export default useStyles;
