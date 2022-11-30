import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";

type Props = {
  imageUrl: string;
  text: string;
};

const useStyles = makeStyles<Theme, Props>(theme => ({
  title: {
    fontFamily: " Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
    fontWeight: 600,
    fontSize: "4em",
    color: "transparent", // used to prop up space
    "&::before": {
      position: "absolute",
      top: 0,
      left: 0,

      width: "100%",
      height: "100%",
      padding: theme.spacing(2),

      content: ({ text }) => `"${text}"`,
      backgroundImage: ({ imageUrl }) => `url(${imageUrl})`,

      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",

      backgroundClip: "text",
      "-webkit-background-clip": "text",
      color: "transparent",
      filter: "invert(1)"
    },
    [theme.breakpoints.down("sm")]: {
      fontSize: "3em"
    }
  }
}));

// The card's background image is blurred, i.e. CardMedia,
// but we want the title to be both inverted and NOT BLURRED,
// this rules out mix-blend-mode: difference,
// because then the title will also be blurred

// And if we just add a second CardMedia as a container for title,
// other children(content and tags) will also be unnecessarily affected

// using ::before pseudo element avoids these pitfalls and doesn't break the layout

const InvertedTitle = (props: Props) => {
  const classes = useStyles(props);

  return (
    <Typography variant="h5" className={classes.title}>
      {props.text}
    </Typography>
  );
};

export default InvertedTitle;
