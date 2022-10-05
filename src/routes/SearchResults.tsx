import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

import { useQuery, useLazyQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton, DisplayTag } from "@components";
import { SEARCH, GET_ALL_TAGS, GET_POSTS_BY_TAGS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { Tag, SearchResult, Post } from "PostTypes";
import { useGetUrlParams } from "@utils";

type TParams = { searchTerm: string };
type Props = RouteComponentProps<TParams>;

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
  const { searchTerm, tagIds } = useGetUrlParams(props.location.search);

  const hasTags = tagIds.length > 0;
  const hasSearchTerm = !!searchTerm && searchTerm.length > 0;
  const tagsOnly = hasTags && !hasSearchTerm;

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
  ] = useLazyQuery<{ getPostsByTags: Post[] }>(GET_POSTS_BY_TAGS);

  // Execute query on url query change
  // Search term is provided, search
  useEffect(() => {
    if (hasSearchTerm) {
      search({
        variables: {
          searchTerm,
          tagIds
        }
      });
    }
  }, [hasSearchTerm, search, searchTerm, tagIds, tagsOnly]);

  // Get posts by tags when search term is empty and tagIds are provided
  useEffect(() => {
    if (tagsOnly) {
      getPostsByTags({
        variables: { tagIds }
      });
    }
  }, [getPostsByTags, tagIds, tagsOnly]);

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
      <NewPostButton />
    </Fragment>
  );
};

export default SearchResults;
