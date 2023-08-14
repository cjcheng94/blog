import React from "react";
import { Link } from "react-router-dom";
import makeStyles from "@mui/styles/makeStyles";
import { useTheme, Theme } from "@mui/material/styles";
import { Typography, useMediaQuery } from "@mui/material";

import noiseSvgUrl from "/assets/noise.svg";

const useStyles = makeStyles<Theme, { logoText: string }>(theme => ({
  logo: {
    position: "relative",
    isolation: "isolate",
    fontFamily: "Notable, sans-serif",
    fontSize: "3rem",

    textDecorationLine: "none",
    backgroundColor: "rgb(0,22,153)",
    background: `linear-gradient(21deg, rgba(0,22,153,1) 0%, rgba(0,99,153,1) 47%, rgba(0,240,205,1) 100%)`,

    backgroundClip: "text",
    "-webkit-background-clip": "text",

    color: theme.palette.mode === "dark" ? "#fff" : "transparent",
    marginTop: "-11px",

    "&::before": {
      content: ({ logoText }: { logoText: string }) => `"${logoText}"`,
      position: "absolute",
      inset: 0,

      mixBlendMode: "overlay",
      backgroundImage: `url(${noiseSvgUrl})`,

      backgroundClip: "text",
      "-webkit-background-clip": "text",

      color: theme.palette.mode === "dark" ? "#fff" : "transparent"
    }
  }
}));

export const Logo = () => {
  const theme = useTheme();
  const logoText = useMediaQuery(theme.breakpoints.down("sm")) ? "B!" : "BLOG!";

  const classes = useStyles({ logoText });
  return (
    <Typography variant="h4" className={classes.logo} component={Link} to="/">
      {logoText}
    </Typography>
  );
};

export default Logo;
