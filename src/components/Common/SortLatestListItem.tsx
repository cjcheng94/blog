import React, { useState, useContext } from "react";
import { ListItem, ListItemIcon, ListItemText, Switch } from "@mui/material";
import { Sort } from "@mui/icons-material";
import { SortingContext } from "@context";

const SortLatestListItem = () => {
  const [checked, setChecked] = useState(true);
  const { refetchFn } = useContext(SortingContext);

  const handleToggle = (
    e: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setChecked(checked);

    const variables = checked
      ? {
          first: 10,
          last: undefined
        }
      : {
          last: 10,
          first: undefined
        };

    refetchFn && refetchFn(variables);
  };

  const text = checked ? "Latest" : "Oldest";

  return (
    <ListItem>
      <ListItemIcon>
        <Sort />
      </ListItemIcon>
      <ListItemText id="switch-list-label-sort" primary={`${text} first`} />
      <Switch
        edge="end"
        onChange={handleToggle}
        checked={checked}
        inputProps={{
          "aria-labelledby": "switch-list-label-sort"
        }}
      />
    </ListItem>
  );
};

export default SortLatestListItem;
