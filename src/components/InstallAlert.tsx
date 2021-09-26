import React from "react";
import { Snackbar, Button, IconButton, makeStyles } from "@material-ui/core";
import { Close } from "@material-ui/icons";

type Props = {
  open: boolean;
  onHide: () => void;
  onInstallClick: () => void;
};

const useStyles = makeStyles(theme => ({
  root: {
    "& .MuiSnackbarContent-root": {
      background: `linear-gradient(45deg, ${theme.palette.primary.dark} 30%, ${theme.palette.primary.light} 90%)`,
      boxShadow: "0 3px 5px 2px rgba(33, 203, 243, .3)"
    }
  },
  installBtn: {
    color: theme.palette.warning.light,
    fontWeight: "bold"
  }
}));

const InstallAlert: React.FC<Props> = ({ open, onHide, onInstallClick }) => {
  const classes = useStyles();
  return (
    <Snackbar
      open={open}
      className={classes.root}
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
