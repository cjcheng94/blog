import React, { useMemo } from "react";
import { Tag } from "PostTypes";
import { DisplayTag } from "@components";
import { Card, CardMedia, Typography, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme: Theme) => {
  const isDarkTheme = theme.palette.type === "dark";
  return {
    card: {
      position: "relative",
      width: "100%",
      height: 290
    },
    cardButton: {
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
      cursor: "pointer",
      padding: theme.spacing(2)
    },
    title: {
      display: "inline-block",
      fontWeight: 600,
      fontSize: "4em",
      fontFamily: " Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
      [theme.breakpoints.down("sm")]: {
        fontSize: "3em"
      }
    },
    content: {
      display: "-webkit-box",
      "-webkit-line-clamp": 3,
      "-webkit-box-orient": "vertical",
      fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
      overflow: "hidden"
    },
    thumbnailedContent: {
      color: "#000",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      backdropFilter: "invert(1) blur(5px)",
      "-webkit-backdrop-filter": "invert(1) blur(5px)"
    },
    tagsContainer: {
      display: "flex",
      flexWrap: "nowrap",
      overflow: "hidden",
      flexShrink: 0,
      zIndex: 1
    },
    tagText: {
      ...theme.typography.button,
      color: theme.palette.text.hint,
      fontWeight: 700,
      lineHeight: 1,
      paddingRight: 4
    },
    media: {
      width: "100%",
      height: "100%",
      filter: "blur(2px)",
      position: "absolute",
      top: 0
    },
    invertedTitleBackground: {
      width: "100%",
      height: "100%",
      backgroundClip: "text",
      "-webkit-background-clip": "text",
      color: "transparent",
      filter: "invert(1)"
    }
  };
});

type Props = {
  _id: string;
  title: string;
  contentText: string;
  tags: Tag[];
  authorInfo?: any;
  onClick: () => void;
  thumbnailUrl?: string;
};

const getTruncatedTitle = (title: string, limit: number) => {
  if (title.length <= limit) {
    return title;
  }

  const wordsArr = title.split(" ");

  let truncatedTitle = wordsArr.reduce((title, curWord, i) => {
    if (title.length > limit) {
      return title;
    }
    return title + curWord + " ";
  }, "");

  truncatedTitle = truncatedTitle.trimEnd();

  if (truncatedTitle.length < title.length) {
    truncatedTitle += "...";
  }

  return truncatedTitle;
};

const ArticleCard: React.FC<Props> = props => {
  const { _id, title, contentText, tags, authorInfo, onClick, thumbnailUrl } =
    props;
  const classes = useStyles();

  const renderTags = (tags: Tag[]) => (
    <>
      {tags
        .slice(0, 3)
        .map(tag => tag && <DisplayTag key={tag._id} value={tag.name} />)}
      {tags.length > 3 ? "..." : ""}
    </>
  );

  const memoizedTags = useMemo(() => renderTags(tags), [tags]);

  const contentClass = `${classes.content} ${classes.thumbnailedContent}`;
  const invertedClass = `${classes.cardButton} ${classes.invertedTitleBackground}`;

  // The card's background image is blurred, i.e. the first CardMedia,
  // but I want the title to be both inverted and NOT BLURRED,
  // so the second CardMedia is used as a non-blurred background for the title to clip

  const thumbnailedCard = (
    <Card className={classes.card}>
      <CardMedia image={thumbnailUrl} className={classes.media} />
      <CardMedia
        image={thumbnailUrl}
        onClick={onClick}
        className={invertedClass}
      >
        <Typography variant="h5" className={classes.title} title={title}>
          {getTruncatedTitle(title, 32)}
        </Typography>
        <Typography className={contentClass}>{contentText}</Typography>
        <div className={classes.tagsContainer}>{memoizedTags}</div>
      </CardMedia>
    </Card>
  );

  const plainCard = (
    <Card className={classes.card}>
      <div className={classes.cardButton} onClick={onClick}>
        <Typography variant="h5" className={classes.title} title={title}>
          {getTruncatedTitle(title, 32)}
        </Typography>
        <Typography className={classes.content}>{contentText}</Typography>
        <div className={classes.tagsContainer}>{memoizedTags}</div>
      </div>
    </Card>
  );

  return thumbnailUrl ? thumbnailedCard : plainCard;
};

export default ArticleCard;
