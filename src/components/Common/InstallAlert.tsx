import React from "react";
import { Snackbar, Button, IconButton } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { Close } from "@material-ui/icons";

type Props = {
  open: boolean;
  onHide: () => void;
  onInstallClick: () => void;
};

const useStyles = makeStyles(theme => {
  const isDarkTheme = theme.palette.type === "dark";
  const gradient = `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.light} 90%)`;
  const background = isDarkTheme ? "#fff" : gradient;
  return {
    root: {
      "& .MuiSnackbarContent-root": {
        color: theme.palette.background.default,
        background
      }
    },
    installBtn: {
      color: theme.palette.warning.light,
      fontWeight: "bold"
    }
  };
});

const InstallAlert: React.FC<Props> = ({ open, onHide, onInstallClick }) => {
  const classes = useStyles();
  return (
    <Snackbar
      open={open}
      className={classes.root}
      onClose={onHide}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right"
      }}
      ContentProps={{
        "aria-describedby": "message-id"
      }}
      message={
        <span>
          Installing use little storage and you can read posts even offline!
        </span>
      }
      action={
        <>
          <Button
            className={classes.installBtn}
            aria-haspopup="true"
            onClick={onInstallClick}
          >
            Install
          </Button>
          <IconButton aria-label="close" color="inherit" onClick={onHide}>
            <Close />
          </IconButton>
        </>
      }
    />
  );
};

export default InstallAlert;
