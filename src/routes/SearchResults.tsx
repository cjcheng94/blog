import React, { useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { Typography } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";
import { useQuery } from "@apollo/client";
import {
  useErrorAlert,
  Cards,
  NewPostButton,
  DisplayTag,
  CardPlaceholder
} from "@components";
import { SEARCH, GET_ALL_TAGS, GET_POSTS_BY_TAGS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { useGetUrlParams } from "@utils";

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
  },
  info: {
    marginBottom: theme.spacing(2)
  }
}));

const SearchResults = () => {
  const classes = useStyles();
  const location = useLocation();
  // Get Search params from URL query
  const { searchTerm, tagIds } = useGetUrlParams(location.search);
  const { showErrorAlert } = useErrorAlert();

  const hasTags = tagIds.length > 0;
  const hasSearchTerm = !!searchTerm && searchTerm.length > 0;
  const tagsOnly = hasTags && !hasSearchTerm;

  // Get all tags to render searched tags
  const {
    loading: getTagsLoading,
    error: getTagsError,
    data: getTagsData
  } = useQuery(GET_ALL_TAGS);

  // Execute query on url query change
  // Search term is provided, search
  const {
    loading: searchLoading,
    error: searchError,
    data: searchData
  } = useQuery(SEARCH, {
    skip: !hasSearchTerm,
    variables: {
      searchTerm: searchTerm as string,
      tagIds
    }
  });

  // Get posts by tags when search term is empty and tagIds are provided

  const {
    loading: getPostsByTagsLoading,
    error: getPostsByTagsError,
    data: getPostsByTagsData
  } = useQuery(GET_POSTS_BY_TAGS, {
    skip: !tagsOnly,
    variables: {
      tagIds
    }
  });

  const isLoading = searchLoading || getPostsByTagsLoading || getTagsLoading;
  const error = searchError || getPostsByTagsError || getTagsError;

  useEffect(() => {
    loadingVar(isLoading);
  }, [isLoading]);

  useEffect(() => {
    showErrorAlert(error);
  }, [error, showErrorAlert]);

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
      return getPostsByTagsData?.getPostsByTags || [];
    }
    return searchData?.search || [];
  };

  const results = getResults();

  return (
    <Fragment>
      <div className={classes.info}>
        <Typography variant="h5" gutterBottom align="center">
          Search results for <strong>{searchTerm}</strong>
        </Typography>
        {tagIds.length > 0 && (
          <div className={classes.tagsRow}>
            <div className={classes.tagsContainer}>{renderTags()}</div>
          </div>
        )}
      </div>
      {isLoading ? <CardPlaceholder /> : <Cards posts={results} />}
      {results.length < 1 && (
        <Typography variant="h5" align="center">
          No results
        </Typography>
      )}
      <NewPostButton />
    </Fragment>
  );
};

export default SearchResults;
