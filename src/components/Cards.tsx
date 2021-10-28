import React from "react";
import orderBy from "lodash/orderBy";
import map from "lodash/map";
import { RouteComponentProps, withRouter } from "react-router-dom";
import { PostsList, Tag } from "PostTypes";
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
    cardsContainer: {
      display: "grid",
      gap: 24,
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
    },
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
      backgroundColor: isDarkTheme ? "#3949ab" : "#e0e5ff"
    },
    author: {
      margin: "8px 0",
      fontSize: "0.8em"
    },
    article: {
      fontSize: "1.1em"
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
  latestFirst?: boolean;
  posts: PostsList;
} & RouteComponentProps;

const isJson = (str: string) => {
  if (typeof str !== "string") {
    return false;
  }
  try {
    JSON.parse(str);
  } catch (error) {
    return false;
  }
  return true;
};

const renderContent = (content: string, textClass: string) => {
  // Temporary solution, add isRichText prop later
  const isContentJson = isJson(content);

  if (isContentJson) {
    return <RichTextEditor readOnly={true} rawContent={content} />;
  }
  return <Typography className={textClass}>{content}</Typography>;
};

const Cards: React.FC<Props> = props => {
  const { latestFirst, posts, history } = props;
  const classes = useStyles();
  //Sort posts by time based on props.latestFirst
  const order = latestFirst ? "desc" : "asc";
  const ordered = orderBy(posts, ["date"], [order]);

  // TODO: apply ellipses to overflowed tags
  const renderTags = (tags: Tag[]) => (
    <>
      {tags
        .slice(0, 3)
        .map(tag => tag && <DisplayTag key={tag._id} value={tag.name} />)}
      {tags.length > 3 ? "..." : ""}
    </>
  );

  const cards = map(ordered, post => {
    const { _id, title, authorInfo, content, tags } = post;
    const url = `/posts/detail/${_id}`;
    return (
      <Card className={classes.card} key={_id}>
        <CardActionArea
          className={classes.cardButton}
          onClick={() => {
            history.push(url);
          }}
        >
          <CardContent className={classes.cardContent}>
            <Typography variant="h5" className={classes.title}>
              {title}
            </Typography>
            <Typography className={classes.author}>
              By {authorInfo.username}
            </Typography>
            {renderContent(content, classes.article)}
          </CardContent>
          <div className={classes.tagsContainer}>{renderTags(tags)}</div>
        </CardActionArea>
      </Card>
    );
  });

  return <div className={classes.cardsContainer}>{cards}</div>;
};

export default withRouter(Cards);
