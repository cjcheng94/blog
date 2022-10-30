import React, { useEffect, Fragment } from "react";
import { RouteComponentProps } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { ErrorAlert, Cards, NewPostButton } from "@components";
import { GET_POSTS_BY_TAGS } from "../api/gqlDocuments";
import { loadingVar } from "../api/cache";
import { Post } from "PostTypes";
import { useGetUrlParams } from "@utils";

const PostsByTags: React.FC<RouteComponentProps> = props => {
  const { tagIds } = useGetUrlParams(props.location.search);

  // Get posts by tags
  const { loading, error, data } = useQuery<{ getPostsByTags: Post[] }>(
    GET_POSTS_BY_TAGS,
    {
      variables: { tagIds },
      skip: tagIds.length < 1
    }
  );

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      <Cards posts={data?.getPostsByTags || []} />
      <NewPostButton />
    </Fragment>
  );
};

export default PostsByTags;
