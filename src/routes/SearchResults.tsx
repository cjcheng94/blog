import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid, Typography } from "@material-ui/core";
import { useQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton } from "@components";
import { SEARCH } from "../gqlDocuments";
import { loadingVar, searchOverlayVar } from "../cache";
import checkIfExpired from "../middlewares/checkTokenExpired";

type TParams = { searchTerm: string };
type Props = RouteComponentProps<TParams>;

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const UserProfile: React.FC<Props> = props => {
  // Get Search term in URL query
  const urlQuery = getUrlQuery(props.location.search);
  const searchTerm = urlQuery.get("searchTerm");

  const isAuthenticated = !checkIfExpired();

  const { loading, error, data } = useQuery(SEARCH, {
    variables: {
      searchTerm
    }
  });

  useEffect(() => {
    loadingVar(loading);
    // Hide SearchOverlay when the query is executed
    if (!loading) {
      searchOverlayVar(false);
    }
  }, [loading]);

  if (loading || !data) {
    return null;
  }

  const searchResults = data.search;

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Typography variant="h5" gutterBottom align="center">
        Search results for "{searchTerm}"
      </Typography>
      <Grid container spacing={3}>
        <Fragment>
          <Cards posts={searchResults} />
          {isAuthenticated && <NewPostButton destination="/posts/new" />}
        </Fragment>
      </Grid>
    </Fragment>
  );
};

export default UserProfile;
