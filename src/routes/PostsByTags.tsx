import React, { useEffect, Fragment } from "react";
import { useLocation } from "react-router-dom";
import { useQuery } from "@apollo/client";
import { Typography } from "@mui/material";

import {
  useErrorAlert,
  Cards,
  NewPostButton,
  CardPlaceholder
} from "@components";
import { GET_POSTS_BY_TAGS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { useGetUrlParams } from "@utils";

const PostsByTags = () => {
  const location = useLocation();
  const { tagIds } = useGetUrlParams(location.search);
  const { showErrorAlert } = useErrorAlert();

  // Get posts by tags
  const { loading, error, data } = useQuery(GET_POSTS_BY_TAGS, {
    variables: { tagIds },
    skip: tagIds.length < 1
  });

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  useEffect(() => {
    showErrorAlert(error);
  }, [error, showErrorAlert]);

  const renderCards = () => {
    if (loading) {
      return <CardPlaceholder />;
    }
    if (!error && data?.getPostsByTags.length! < 1) {
      return (
        <Typography variant="h5" align="center">
          No results
        </Typography>
      );
    }

    return <Cards type="post" posts={data?.getPostsByTags} />;
  };

  return (
    <Fragment>
      {renderCards()}
      <NewPostButton />
    </Fragment>
  );
};

export default PostsByTags;
