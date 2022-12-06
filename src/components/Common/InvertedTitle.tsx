import React from "react";
import { makeStyles, Theme } from "@material-ui/core/styles";
import { Typography } from "@material-ui/core";
import { useLoadImage } from "@utils";

type Props = {
  imageUrl: string;
  text: string;
};

const useStyles = makeStyles<Theme, { loadedUrl: string | null; text: string }>(
  theme => ({
    title: {
      fontFamily: " Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
      fontWeight: 600,
      fontSize: "4em",
      color: "transparent", // used to prop up space
      wordBreak: "break-word",
      padding: theme.spacing(2),
      paddingBottom: 0,
      "&::before": {
        position: "absolute",
        top: 0,
        left: 0,

        width: "100%",
        height: "100%",
        padding: theme.spacing(2),

        content: ({ text }) => `"${text}"`,
        backgroundImage: ({ loadedUrl }) =>
          loadedUrl
            ? `url(${loadedUrl})`
            : "radial-gradient(circle, rgba(1,65,255,1) -30%, rgba(0,0,0,1) 128%)",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",

        backgroundClip: "text",
        "-webkit-background-clip": "text",
        color: "transparent",
        filter: ({ loadedUrl }) =>
          loadedUrl ? "invert(1) drop-shadow(1px 1px 0px black)" : "none"
      },
      [theme.breakpoints.down("sm")]: {
        fontSize: "3em"
      }
    }
  })
);

// The card's background image is blurred, i.e. CardMedia,
// but we want the title to be both inverted and NOT BLURRED,
// this rules out mix-blend-mode: difference,
// because then the title will also be blurred

// And if we just add a second CardMedia as a container for title,
// other children(content and tags) will also be unnecessarily affected

// using ::before pseudo element avoids these pitfalls and doesn't break the layout

const InvertedTitle = (props: Props) => {
  const { imageUrl, text } = props;
  const loadedUrl = useLoadImage(imageUrl);
  const classes = useStyles({ loadedUrl, text });

  return (
    <Typography variant="h5" className={classes.title}>
      {text}
    </Typography>
  );
};

export default InvertedTitle;
