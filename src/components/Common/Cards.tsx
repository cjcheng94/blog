import React from "react";
import orderBy from "lodash/orderBy";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { Post, Draft } from "PostTypes";
import { ArticleCard } from "@components";
import { makeStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { GET_SORT_LATEST_FIRST } from "../../api/gqlDocuments";

const useStyles = makeStyles(() => ({
  cardsContainer: {
    display: "grid",
    gap: 24,
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
  }
}));

type Props = {
  type?: "post" | "draft";
  drafts?: Draft[];
  posts?: Post[];
} & RouteComponentProps;

const Cards: React.FC<Props> = props => {
  const classes = useStyles();
  const { data } = useQuery(GET_SORT_LATEST_FIRST);

  const { sortLatestFirst } = data;
  const { history, type, posts, drafts } = props;

  if (!posts && !drafts) {
    return null;
  }

  let articles: Array<Post | Draft> = [];

  if ((!type || type === "post") && posts) {
    articles = posts;
  } else if (type === "draft" && drafts) {
    articles = drafts;
  }

  //Sort posts by time based on props.latestFirst
  const order = sortLatestFirst ? "desc" : "asc";
  const ordered = orderBy(articles, ["date"], [order]);

  const cards = ordered.map(article => {
    const { _id, title, content, tags } = article;

    const authorInfo = "authorInfo" in article ? article.authorInfo : undefined;

    let url = `/posts/detail/${_id}`;

    if (type === "draft") {
      url = `/posts/edit/${_id}?isDraft`;
    }

    return (
      <ArticleCard
        _id={_id}
        key={_id}
        title={title}
        content={content}
        tags={tags}
        authorInfo={authorInfo}
        onClick={() => {
          history.push(url);
        }}
      />
    );
  });

  return <div className={classes.cardsContainer}>{cards}</div>;
};

export default withRouter(Cards);
