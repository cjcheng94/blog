import React from "react";

import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  tag: {
    ...theme.typography.button,
    color: theme.palette.primary.main,
    backgroundColor: "rgba(0,0,0,0.1)",
    fontWeight: 700,
    lineHeight: 1,
    marginRight: 4,
    padding: 4,
    borderRadius: 4
  }
}));

interface Props {
  value: string;
  [x: string]: any;
}
const DisplayTag: React.FC<Props> = props => {
  const classes = useStyles();
  return (
    <div className={classes.tag} {...props}>
      {props.value}
    </div>
  );
};

export default DisplayTag;
