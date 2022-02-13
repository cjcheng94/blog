import React from "react";
import { Tag } from "PostTypes";
import { RichTextEditor, DisplayTag } from "@components";
import {
  Card,
  CardActionArea,
  CardContent,
  Typography,
  makeStyles,
  Theme
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) => {
  const isDarkTheme = theme.palette.type === "dark";
  return {
    card: {
      width: "100%",
      height: 214
    },
    cardButton: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      padding: theme.spacing(2)
    },
    cardContent: {
      padding: 0,
      overflow: "hidden",
      marginBottom: theme.spacing(2)
      // display: "-webkit-box",
      // "-webkit-line-clamp": 6,
      // "-webkit-box-orient": "vertical",
    },
    title: {
      display: "inline",
      paddingLeft: 2,
      paddingRight: 4,
      fontWeight: 700,
      backgroundColor: isDarkTheme ? "hsl(230,0%,20%)" : "hsl(230,100%,94%);"
    },
    author: {
      margin: "8px 0",
      fontSize: "0.8em"
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "nowrap",
      overflow: "hidden",
      flexShrink: 0
    },
    tagText: {
      ...theme.typography.button,
      color: theme.palette.text.hint,
      fontWeight: 700,
      lineHeight: 1,
      paddingRight: 4
    }
  };
});

type Props = {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  authorInfo?: any;
  onClick: () => void;
};

const ArticleCard: React.FC<Props> = props => {
  const { _id, title, content, tags, authorInfo, onClick } = props;
  const classes = useStyles();

  // TODO: apply ellipses to overflowed tags
  const renderTags = (tags: Tag[]) => (
    <>
      {tags
        .slice(0, 3)
        .map(tag => tag && <DisplayTag key={tag._id} value={tag.name} />)}
      {tags.length > 3 ? "..." : ""}
    </>
  );

  return (
    <Card className={classes.card}>
      <CardActionArea className={classes.cardButton} onClick={onClick}>
        <CardContent className={classes.cardContent}>
          <Typography variant="h5" className={classes.title}>
            {title}
          </Typography>
          {authorInfo && (
            <Typography className={classes.author}>
              By {authorInfo.username}
            </Typography>
          )}
          <RichTextEditor readOnly={true} rawContent={content} />
        </CardContent>
        <div className={classes.tagsContainer}>{renderTags(tags)}</div>
      </CardActionArea>
    </Card>
  );
};

export default ArticleCard;
