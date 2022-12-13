import React from "react";
import { Card, CardActionArea, CardContent, Theme } from "@mui/material";
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles((theme: Theme) => {
  const isDarkTheme = theme.palette.mode === "dark";
  const textColor = isDarkTheme ? "#616161" : "#F0F0F0";
  return {
    cardsContainer: {
      display: "grid",
      gap: 24,
      gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
      [theme.breakpoints.down('md')]: {
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))"
      }
    },
    card: {
      width: "100%",
      height: 294,
      [theme.breakpoints.down('md')]: {
        height: 260
      }
    },
    cardButton: {
      width: "100%",
      height: "100%"
    },
    content: {
      height: "100%"
    },
    title: {
      height: "40px",
      width: "70%",
      backgroundColor: isDarkTheme ? "hsl(230,0%,20%)" : "hsl(230,100%,94%);"
    },
    author: {
      margin: "1em 0",
      height: 16,
      width: "6em",
      backgroundColor: textColor
    },
    article: {
      marginBottom: 6,
      height: 16,
      width: "100%",
      backgroundColor: textColor,
      "&:nth-child(3)": {
        marginTop: 32
      }
    }
  };
});

const CardPlaceholder: React.FC = props => {
  const classes = useStyles();
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
                <div className={classes.article} />
              </CardContent>
            </CardActionArea>
          </Card>
        );
      })}
    </div>
  );
};
export default CardPlaceholder;
