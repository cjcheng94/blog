import React from "react";
import {
  Card,
  CardActionArea,
  CardContent,
  withStyles,
  createStyles,
  Theme,
  WithStyles
} from "@material-ui/core";

const styles = (theme: Theme) =>
  createStyles({
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
      height: "100%"
    },
    content: {
      height: "100%"
    },
    title: {
      height: 28,
      width: 150,
      backgroundColor: "hsl(230, 100%, 94%)"
    },
    author: {
      margin: "1em 0",
      height: 16,
      width: "6em",
      backgroundColor: "#F0F0F0"
    },
    article: {
      marginBottom: 6,
      height: 16,
      width: "100%",
      backgroundColor: "#F0F0F0"
    }
  });

interface Props extends WithStyles<typeof styles> {}

const CardPlaceholder: React.FC<Props> = props => {
  const { classes } = props;
  //Render 12 "empty" cards:
  //Create an ITERABLE array with a length of 12, and then .map()
  return (
    <div className={classes.cardsContainer}>
      {[...Array(12)].map((e, i) => {
        return (
          <Card className={classes.card} key={i}>
            <CardActionArea className={classes.cardButton}>
              <CardContent className={classes.content}>
                <div className={classes.title} />
                <div className={classes.author} />
                <div className={classes.article} />
                <div className={classes.article} />
                <div className={classes.article} />
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
};
export default withStyles(styles)(CardPlaceholder);
