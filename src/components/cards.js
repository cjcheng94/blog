import React, { Component } from "react";
import map from "lodash/map";
import { Link } from "react-router-dom";

import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Grid from "@material-ui/core/Grid";
import { withStyles } from "@material-ui/core/styles";

const styles = theme => ({
  card: {
    width: "100%",
    [theme.breakpoints.up("sm")]: {
      height: 200
    }
  },
  cardButton: {
    width: "100%"
  },
  title: {
    display: "inline",
    paddingLeft: 2,
    paddingRight: 4,
    fontWeight: 700,
    backgroundColor: "hsl(187, 72%, 93%)"
  },
  author: {
    margin: "1em 0"
  },
  article: {
    fontSize: "1.1em"
  }
});

class Cards extends Component {
  render() {
    const { classes } = this.props;
    //this.props.posts is an object
    return map(this.props.posts, post => {
      const url = `/posts/detail/${post._id}`;
      return (
        <Grid item xs={12} sm={6} md={4} lg={3} key={post._id}>
          <CardActionArea
            className={classes.cardButton}
            component={Link}
            to={url}
          >
            <Card className={classes.card}>
              <CardContent>
                <Typography
                  variant="headline"
                  component="h2"
                  className={classes.title}
                >
                  {post.title}
                </Typography>
                <Typography className={classes.author}>
                  By {post.author}
                </Typography>
                <Typography component="p" className={classes.article}>
                  {post.content.slice(0, 60)}
                  ...
                </Typography>
              </CardContent>
            </Card>
          </CardActionArea>
        </Grid>
      );
    });
  }
}
export default withStyles(styles)(Cards);
