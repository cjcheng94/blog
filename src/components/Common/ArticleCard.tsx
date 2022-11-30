import React, { useState, useMemo } from "react";
import { Tag } from "PostTypes";
import { DisplayTag, InvertedTitle } from "@components";
import { Card, CardMedia, Typography, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles<Theme, { filter: string }>((theme: Theme) => {
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
      color: "#fff",
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(5px)",
      "-webkit-backdrop-filter": "blur(5px)"
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
      position: "absolute",
      top: 0,
      filter: ({ filter }) => filter,
      transition: theme.transitions.create("filter", {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.shortest
      })
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
  const [isHovered, setIsHovered] = useState(false);
  const classes = useStyles({ filter: isHovered ? "unset" : "blur(3px)" });
  const { _id, title, contentText, tags, authorInfo, onClick, thumbnailUrl } =
    props;

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

  const thumbnailedCard = (
    <Card
      className={classes.card}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      <CardMedia image={thumbnailUrl} className={classes.media} />
      <div onClick={onClick} className={classes.cardButton}>
        <InvertedTitle
          text={getTruncatedTitle(title, 32)}
          imageUrl={thumbnailUrl as string}
        />
        <Typography className={contentClass}>{contentText}</Typography>
        <div className={classes.tagsContainer}>{memoizedTags}</div>
      </div>
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
