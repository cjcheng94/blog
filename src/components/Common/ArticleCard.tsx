import React, { ForwardedRef, useMemo } from "react";
import { Tag } from "@graphql";
import { DisplayTag, InvertedTitle } from "@components";
import { Card, Typography, Theme } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles((theme: Theme) => ({
  card: {
    position: "relative",
    width: "100%",
    cursor: "pointer",
    height: 294,
    [theme.breakpoints.down("md")]: {
      height: 260
    }
  },
  cardContainer: {
    width: "100%",
    height: "calc(100% - 54px)",
    display: "flex",
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start"
  },
  title: {
    display: "inline-block",
    wordBreak: "break-word",
    fontWeight: 700,
    fontSize: "4em",
    fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
    margin: theme.spacing(2),
    marginBottom: 0,
    [theme.breakpoints.down("md")]: {
      fontSize: "3em"
    }
  },
  content: {
    width: "calc(100% - 32px)",
    margin: `0 ${theme.spacing(2)}`,
    padding: "1px 5px",
    borderRadius: 4,
    overflow: "hidden",
    fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
    display: "-webkit-box",
    "-webkit-line-clamp": 3,
    "-webkit-box-orient": "vertical"
  },
  tagsContainer: {
    position: "relative",
    bottom: -16,
    marginLeft: theme.spacing(2),
    display: "flex",
    flexWrap: "nowrap",
    overflow: "hidden"
  },
  media: {
    width: "100%",
    height: "100%",
    position: "absolute",
    top: 0,
    filter: "blur(3px)"
  }
}));

type Props = {
  _id: string;
  title: string;
  contentText: string;
  tags: Tag[];
  authorInfo?: any;
  onClick: () => void;
  thumbnailUrl?: string | null;
};

const getTruncatedTitle = (title: string, limit: number) => {
  if (title.length <= limit) {
    return title;
  }

  const wordsArr = title.split(" ");
  let truncatedTitle = "";

  wordsArr.every(word => {
    let titleWithAnotherWord = truncatedTitle + word + " ";
    if (titleWithAnotherWord.length > limit) {
      return false;
    }
    truncatedTitle = titleWithAnotherWord;
    return true;
  });

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

const ArticleCard = (props: Props, ref: React.Ref<HTMLDivElement>) => {
  const { title, contentText, tags, onClick, thumbnailUrl } = props;
  const classes = useStyles();
  const memoizedTags = useMemo(() => renderTags(tags), [tags]);

  return (
    <Card onClick={onClick} className={classes.card} ref={ref}>
      <div className={classes.cardContainer}>
        {thumbnailUrl ? (
          <InvertedTitle
            text={getTruncatedTitle(title, 32)}
            imageUrl={thumbnailUrl as string}
          />
        ) : (
          <Typography variant="h5" className={classes.title} title={title}>
            {getTruncatedTitle(title, 32)}
          </Typography>
        )}
        <Typography className={classes.content}>{contentText}</Typography>
      </div>
      <div className={classes.tagsContainer}>{memoizedTags}</div>
    </Card>
  );
};

export default React.forwardRef(ArticleCard);
