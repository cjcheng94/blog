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
import { useQuery } from "@apollo/client";
import { GET_SORT_LATEST_FIRST } from "../../api/gqlDocuments";

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
  posts: PostsList;
} & RouteComponentProps;

const Cards: React.FC<Props> = props => {
  const classes = useStyles();
  const { data } = useQuery(GET_SORT_LATEST_FIRST);

  const { posts, history } = props;
  const { sortLatestFirst } = data;

  //Sort posts by time based on props.latestFirst
  const order = sortLatestFirst ? "desc" : "asc";
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
            <RichTextEditor readOnly={true} rawContent={content} />
          </CardContent>
          <div className={classes.tagsContainer}>{renderTags(tags)}</div>
        </CardActionArea>
      </Card>
    );
  });

  return <div className={classes.cardsContainer}>{cards}</div>;
};

export default withRouter(Cards);
