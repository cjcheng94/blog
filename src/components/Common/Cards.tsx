import React from "react";
import orderBy from "lodash/orderBy";
import { useHistory } from "react-router-dom";
import { Post, Draft } from "PostTypes";
import { ArticleCard, PaginationLink } from "@components";
import makeStyles from '@mui/styles/makeStyles';
import { useReactiveVar } from "@apollo/client";
import { sortLatestFirstVar } from "../../api/cache";

const useStyles = makeStyles(theme => ({
  cardsContainer: {
    display: "grid",
    gap: 24,
    gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    [theme.breakpoints.down('md')]: {
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
    }
  }
}));

type Props = {
  type?: "post" | "draft";
  drafts?: Draft[];
  posts?: Post[];
};

const Cards: React.FC<Props> = ({ type, posts, drafts }) => {
  const classes = useStyles();
  const sortLatestFirst = useReactiveVar(sortLatestFirstVar);
  const history = useHistory();

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
  const orderedArticles = orderBy(articles, ["date"], [order]);

  // Get the current page number form url query
  const searchParams = new URLSearchParams(location.search);
  const currentPage = parseInt(searchParams.get("page") || "1", 10);

  // TODO: Dynamically calculate the appropriate limit based on window size
  // Number of items for each page
  const paginationLimit = 20;

  // Current items to show
  const paginatedArticles = orderedArticles.slice(
    (currentPage - 1) * paginationLimit,
    (currentPage - 1) * paginationLimit + paginationLimit
  );

  // Show pagination when number of items exceeds the limit
  const pageCount = Math.ceil(articles.length / paginationLimit);
  const showPagination = pageCount > 1;

  const cards = paginatedArticles.map(article => {
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
      {showPagination && <PaginationLink pageCount={pageCount} />}
    </div>
  );
};

export default Cards;
