import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Grid, Typography, makeStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton, DisplayTag } from "@components";
import { SEARCH, GET_ALL_TAGS } from "../gqlDocuments";
import { loadingVar } from "../cache";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { Tag, SearchResult } from "PostTypes";

type TParams = { searchTerm: string };
type Props = RouteComponentProps<TParams>;

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const useStyles = makeStyles(theme => ({
  tagsRow: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%"
  },
  tagsContainer: {
    maxWidth: "100%",
    display: "flex",
    flexWrap: "wrap",
    marginLeft: theme.spacing(1)
  }
}));

const SearchResults: React.FC<Props> = props => {
  // Get Search params from URL query
  const urlQuery = getUrlQuery(props.location.search);
  const searchTerm = urlQuery.get("searchTerm");
  const tagIds = urlQuery.getAll("tagIds");
  const classes = useStyles();
  const isAuthenticated = !checkIfExpired();

  // Get all tags to render searched tags
  const { data: getTagsData, loading: getTagsLoading } =
    useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  // Execute search gql query
  const {
    loading: searchLoading,
    error,
    data: searchData
  } = useQuery<{ search: SearchResult[] }>(SEARCH, {
    variables: {
      searchTerm,
      tagIds
    }
  });

  useEffect(() => {
    loadingVar(searchLoading || getTagsLoading);
  }, [searchLoading, getTagsLoading]);

  if (searchLoading || !searchData) {
    return null;
  }

  const searchResults = searchData.search;

  const renderTags = () => {
    if (!getTagsData?.tags) return;

    // Get searched tags
    const tagsToSearch = getTagsData.tags.filter(({ _id }) =>
      tagIds.includes(_id)
    );

    return tagsToSearch.map(tag => {
      if (!tag) return;
      return (
        <DisplayTag
          key={tag._id}
          value={tag.name}
          style={{ marginBottom: 8 }}
        />
      );
    });
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Typography variant="h5" gutterBottom align="center">
        Search results for "{searchTerm}"
      </Typography>
      {tagIds.length > 0 && (
        <div className={classes.tagsRow}>
          with Tags <div className={classes.tagsContainer}>{renderTags()}</div>
        </div>
      )}
      <Grid container spacing={3}>
        <Fragment>
          <Cards posts={searchResults} />
          {isAuthenticated && <NewPostButton destination="/posts/new" />}
        </Fragment>
      </Grid>
    </Fragment>
  );
};

export default SearchResults;
