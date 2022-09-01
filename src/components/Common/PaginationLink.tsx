import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import Pagination from "@material-ui/lab/Pagination";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles(theme => ({
  container: {
    paddingTop: 16
  }
}));

type Props = {
  pageCount: number;
} & RouteComponentProps;

const PaginationLink: React.FC<Props> = ({ history, location, pageCount }) => {
  const classes = useStyles();
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

export default withRouter(PaginationLink);
