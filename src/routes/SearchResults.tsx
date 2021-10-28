import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Typography, makeStyles } from "@material-ui/core";
import { useQuery, useLazyQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton, DisplayTag } from "@components";
import { SEARCH, GET_ALL_TAGS, GET_POSTS_BY_TAGS } from "../gqlDocuments";
import { loadingVar } from "../cache";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { Tag, SearchResult, PostsList } from "PostTypes";

type TParams = { searchTerm: string };
type Props = RouteComponentProps<TParams>;

const getUrlQuery = (urlQuery: string) => new URLSearchParams(urlQuery);

const useStyles = makeStyles(theme => ({
  tagsRow: {
    display: "flex",
    width: "fit-content",
    maxWidth: "100%",
    margin: "auto",
    marginBottom: theme.spacing(1)
  },
  tagsContainer: {
    maxWidth: "100%",
    display: "flex",
    flexWrap: "wrap",
    marginLeft: theme.spacing(1)
  }
}));

const SearchResults: React.FC<Props> = props => {
  const classes = useStyles();
  // Get Search params from URL query
  const urlQuery = getUrlQuery(props.location.search);
  const searchTerm = urlQuery.get("searchTerm");
  const tagIds = urlQuery.getAll("tagIds");

  const hasTags = tagIds.length > 0;
  const hasSearchTerm = !!searchTerm && searchTerm.length > 0;
  const tagsOnly = hasTags && !hasSearchTerm;

  const isAuthenticated = !checkIfExpired();

  // Get all tags to render searched tags
  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: getTagsData
  } = useQuery<{ tags: Tag[] }>(GET_ALL_TAGS);

  // Search
  const [
    search,
    { loading: searchLoading, error: searchError, data: searchData }
  ] = useLazyQuery<{ search: SearchResult[] }>(SEARCH);

  // Get posts by tags
  const [
    getPostsByTags,
    {
      loading: getPostsByTagsLoading,
      error: getPostsByTagsError,
      data: getPostsByTagsData
    }
  ] = useLazyQuery<{ getPostsByTags: PostsList }>(GET_POSTS_BY_TAGS);

  // Execute query on url query change
  useEffect(() => {
    // Get posts by tags when search term is empty and tagIds are provided
    if (tagsOnly) {
      getPostsByTags({
        variables: { tagIds }
      });
      return;
    }
    // Search term is provided, search
    search({
      variables: {
        searchTerm,
        tagIds
      }
    });
  }, [props.location.search]);

  useEffect(() => {
    loadingVar(searchLoading || getPostsByTagsLoading || getTagsLoading);
  }, [searchLoading, getPostsByTagsLoading, getTagsLoading]);

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

  const getResults = () => {
    if (tagsOnly) {
      if (getPostsByTagsData && getPostsByTagsData.getPostsByTags) {
        return getPostsByTagsData.getPostsByTags;
      }
    }
    if (searchData && searchData.search) {
      return searchData.search;
    }
    return [];
  };

  const renderError = () => {
    const error = searchError || getPostsByTagsError || getTagsError;
    return error && <ErrorAlert error={error} />;
  };

  return (
    <Fragment>
      {renderError()}
      <Typography variant="h5" gutterBottom align="center">
        Search results for <strong>{searchTerm}</strong>
      </Typography>
      {tagIds.length > 0 && (
        <div className={classes.tagsRow}>
          <div className={classes.tagsContainer}>{renderTags()}</div>
        </div>
      )}
      <Cards posts={getResults()} />
      {isAuthenticated && <NewPostButton destination="/posts/new" />}
    </Fragment>
  );
};

export default SearchResults;
