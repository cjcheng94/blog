import React, { Fragment, useEffect } from "react";
import { useQuery } from "@apollo/client";
import { Tooltip } from "@material-ui/core";
import { ErrorAlert, Cards, CardPlaceholder, NewPostButton } from "@components";
import checkIfExpired from "../middlewares/checkTokenExpired";
import { GET_ALL_POSTS } from "../gqlDocuments";
import { loadingVar } from "../cache";

const PostIndex = () => {
  const { loading, error, data } = useQuery(GET_ALL_POSTS);

  useEffect(() => {
    loadingVar(loading);
  }, [loading]);

  const isAuthenticated = !checkIfExpired();
  const writeButtonPath = isAuthenticated ? "/posts/new" : "/user/signup";

  const renderCards = () => {
    if (loading || !data?.posts) {
      return <CardPlaceholder />;
    }
    return <Cards posts={data.posts} latestFirst={false} />;
  };

  return (
    <Fragment>
      {error && <ErrorAlert error={error} />}
      {renderCards()}
      {/* Direct user to sign up page or if already signed in, write new page */}
      <Tooltip title="Write a story">
        <NewPostButton destination={writeButtonPath} />
      </Tooltip>
    </Fragment>
  );
};

export default PostIndex;
