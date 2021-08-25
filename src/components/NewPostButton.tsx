import React from "react";
import { Link } from "react-router-dom";
import { Edit } from "@material-ui/icons";
import { Fab, makeStyles, createStyles, Theme } from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    fab: {
      position: "fixed",
      bottom: "2em",
      right: "2em"
    }
  })
);

type Props = {
  destination: string;
};

const NewPostButton = React.forwardRef<HTMLDivElement, Props>((props, ref) => {
  const classes = useStyles();
  return (
    <div {...props} ref={ref}>
      <Fab
        color="secondary"
        aria-label="new post"
        className={classes.fab}
        component={Link}
        to={props.destination}
      >
        <Edit />
      </Fab>
    </div>
  );
});
export default NewPostButton;
