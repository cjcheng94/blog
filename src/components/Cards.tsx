import React from "react";
import orderBy from "lodash/orderBy";
import map from "lodash/map";
import { Link } from "react-router-dom";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import {
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core/styles";
import { PostsHub } from "PostTypes";
import { RichTextEditor } from "@components";

const styles = (theme: Theme) => {
  const isDarkTheme = theme.palette.type === "dark";
  return createStyles({
    card: {
      width: "100%",
      height: 200,
      padding: theme.spacing(2),
      paddingBottom: theme.spacing(3)
    },
    cardButton: {
      width: "100%"
    },
    cardContent: {
      height: "100%",
      padding: 0,
      overflow: "hidden",
      textOverflow: "ellipsis"
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
    }
  });
};

interface Props extends WithStyles<typeof styles> {
  latestFirst?: boolean;
  posts: PostsHub;
}

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
  const { classes, latestFirst, posts } = props;

  //Sort posts by time based on props.latestFirst
  const order = latestFirst ? "desc" : "asc";
  const ordered = orderBy(posts, ["date"], [order]);

  const cards = map(ordered, post => {
    const url = `/posts/detail/${post._id}`;
    return (
      <Grid item xs={12} sm={6} md={4} lg={3} xl={2} key={post._id}>
        <CardActionArea
          className={classes.cardButton}
          component={Link}
          to={url}
        >
          <Card className={classes.card}>
            <CardContent className={classes.cardContent}>
              <Typography variant="h5" className={classes.title}>
                {post.title}
              </Typography>
              <Typography className={classes.author}>
                By {post.author}
              </Typography>
              {renderContent(post.content, classes.article)}
            </CardContent>
          </Card>
        </CardActionArea>
      </Grid>
    );
  });

  return <>{cards}</>;
};

export default withStyles(styles)(Cards);
