import React from "react";
import { useHistory, useLocation } from "react-router-dom";
import Pagination from '@mui/material/Pagination';
import makeStyles from '@mui/styles/makeStyles';

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: 16
  }
}));

const PaginationLink = ({ pageCount }: { pageCount: number }) => {
  const classes = useStyles();
  const history = useHistory();
  const location = useLocation();
  // Get page number from url query
  const searchParams = new URLSearchParams(location.search);
  const page = parseInt(searchParams.get("page") || "1", 10);

  // Set "page" query param when user changes page number
  const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
    searchParams.set("page", value.toString());
    const queryString = searchParams.toString();
    const url = `${location.pathname}?${queryString}`;

    // Change page
    history.push(url);

    // Scroll to top after page change
    window.scrollTo({ top: 0 });
  };

  return (
    <div className={classes.container}>
      <Pagination
        color="primary"
        size="large"
        page={page}
        count={pageCount}
        onChange={handleChange}
      />
    </div>
  );
};

export default PaginationLink;
