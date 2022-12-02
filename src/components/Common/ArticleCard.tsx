import React, { useState, useMemo } from "react";
import { Tag } from "PostTypes";
import { DisplayTag, InvertedTitle } from "@components";
import { Card, CardMedia, Typography, Theme } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { useLoadImage } from "@utils";

const useStyles = makeStyles<Theme, { filter?: string }>((theme: Theme) => ({
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
  },
  fallbackMedia: {
    background:
      "radial-gradient(circle, rgba(1,65,255,0.34) -30%, rgba(0,0,0,0.06) 128%)"
  }
}));

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

const renderTags = (tags: Tag[]) => (
  <>
    {tags
      .slice(0, 3)
      .map(tag => tag && <DisplayTag key={tag._id} value={tag.name} />)}
    {tags.length > 3 ? "..." : ""}
  </>
);

const ThumbnailedCard = (props: Props) => {
  const { title, contentText, tags, onClick, thumbnailUrl } = props;

  const [isHovered, setIsHovered] = useState(false);
  const classes = useStyles({ filter: isHovered ? "none" : "blur(3px)" });
  const loadedThumbnailUrl = useLoadImage(thumbnailUrl as string);

  const memoizedTags = useMemo(() => renderTags(tags), [tags]);

  const contentClass = `${classes.content} ${classes.thumbnailedContent}`;
  const fallbackMediaClass = `${classes.media} ${classes.fallbackMedia}`;

  return (
    <Card
      className={classes.card}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
    >
      {loadedThumbnailUrl ? (
        <CardMedia image={loadedThumbnailUrl} className={classes.media} />
      ) : (
        <div className={fallbackMediaClass} />
      )}
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
};

const PlainCard = (props: Props) => {
  const classes = useStyles({});
  const { title, contentText, tags, onClick } = props;

  const memoizedTags = useMemo(() => renderTags(tags), [tags]);

  return (
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
};

const ArticleCard: React.FC<Props> = props =>
  props.thumbnailUrl ? (
    <ThumbnailedCard {...props} />
  ) : (
    <PlainCard {...props} />
  );

export default ArticleCard;
