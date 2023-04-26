import React from "react";
import { Chip, Link, Button } from "@mui/material";
import { GitHub, Send } from "@mui/icons-material";

import makeStyles from "@mui/styles/makeStyles";

const useStyles = makeStyles(theme => ({
  container: {
    maxWidth: 1000,
    margin: "0px auto",
    fontFamily: "Source Serif Pro, PingFang SC, Microsoft YaHei, serif",
    fontSize: 18,
    "-webkit-font-smoothing": "antialiased",
    "-moz-osx-font-smoothing": "grayscale"
  }
}));

const About = () => {
  const classes = useStyles();
  return (
    <div className={classes.container}>
      <p>Hi there! my name is 程佳乐 or CJ.</p>
      <p>
        As you&apos;ve probably gathered from my blog posts, I&apos;m a
        front-end developer. 😆
      </p>
      <p>
        If you have any questions or inquiries feel free to{" "}
        <Button
          endIcon={<Send />}
          component={Link}
          href="mailto:cjchengbiz@gmail.com">
          Email me
        </Button>
      </p>

      <div>
        <span>Also, you can find the code for this site on my </span>
        <a
          href="https://github.com/cjcheng94/"
          target="_blank"
          rel="noreferrer">
          <Chip
            component="span"
            icon={<GitHub />}
            label="GitHub"
            size="small"
            color="primary"
            variant="outlined"
            clickable
          />
        </a>
      </div>
    </div>
  );
};

export default About;
