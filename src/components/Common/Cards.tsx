import React from "react";
import { useHistory } from "react-router-dom";
import { Post, Draft } from "@graphql";
import { ArticleCard } from "@components";
import makeStyles from "@mui/styles/makeStyles";
import { Button } from "@mui/material";

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    display: "grid",
    gap: 24,
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    [theme.breakpoints.down("md")]: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
    }
  }
}));

type GetAllPostReturnType = Pick<
  Post,
  | "_id"
  | "authorInfo"
  | "contentText"
  | "date"
  | "tagIds"
  | "tags"
  | "thumbnailUrl"
  | "title"
>;

type Props = {
  type?: "post" | "draft";
  drafts?: Draft[];
  posts?: GetAllPostReturnType[];
  fetchMore?: () => void;
  hasNextPage?: boolean;
};

const Cards: React.FC<Props> = ({
  type,
  posts,
  drafts,
  fetchMore,
  hasNextPage
}) => {
  const classes = useStyles();
  const history = useHistory();

  if (!posts && !drafts) {
    return null;
  }

  let articles: Array<GetAllPostReturnType | Draft> = [];

  if ((!type || type === "post") && posts) {
    articles = posts;
  } else if (type === "draft" && drafts) {
    articles = drafts;
  }

  const cards = articles.map(article => {
    const { _id, title, contentText, tags } = article;

    const thumbnailUrl =
      "thumbnailUrl" in article ? article.thumbnailUrl : undefined;

    const authorInfo = "authorInfo" in article ? article.authorInfo : undefined;

    let url = `/posts/detail/${_id}`;

    if (type === "draft") {
      url = `/drafts/edit/${_id}`;
    }

    return (
      <ArticleCard
        _id={_id}
        key={_id}
        title={title}
        contentText={contentText}
        tags={tags}
        authorInfo={authorInfo}
        thumbnailUrl={thumbnailUrl}
        onClick={() => {
          history.push(url);
        }}
      />
    );
  });

  return (
    <div>
      <div className={classes.cardsContainer}>{cards}</div>
      {hasNextPage && <Button onClick={fetchMore}>Load More</Button>}
    </div>
  );
};

export default Cards;
