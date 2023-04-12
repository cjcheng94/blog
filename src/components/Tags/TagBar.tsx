import React from "react";
import { Chip, CircularProgress } from "@mui/material";
import makeStyles from "@mui/styles/makeStyles";

import { useQuery, useMutation } from "@apollo/client";
import { NewTagInput } from "@components";
import { GET_ALL_TAGS, CREATE_TAG } from "../../api/gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    display: "flex",
    alignItems: "center",
    flexWrap: "wrap",
    marginBottom: theme.spacing(0.5)
  },
  tags: {
    marginTop: theme.spacing(0.5),
    marginBottom: theme.spacing(0.5),
    marginRight: theme.spacing(1)
  }
}));

type TagRowProps = {
  onChange?: (tag: Tag) => void;
  selectedTagIds?: string[];
};

const TagRow: React.FC<TagRowProps> = ({ onChange, selectedTagIds }) => {
  const classes = useStyles();

  // Get all tags
  const { data, loading: getAllTagsLoading } = useQuery(GET_ALL_TAGS);

  // Create-tag gql mutation
  const [createTag, { loading: createTagLoading }] = useMutation(CREATE_TAG, {
    refetchQueries: [{ query: GET_ALL_TAGS }]
  });

  // Trigger onChange function from parent
  const handleTagChange = (tag: Tag) => () => {
    if (onChange) {
      return onChange(tag);
    }
  };

  const isSelected = (id: string) => {
    if (!selectedTagIds) {
      return false;
    }
    return selectedTagIds.includes(id);
  };

  // Call create-tag gql mutation
  const handleCreateTag = (tagName: string) => {
    if (tagName.length < 1) {
      return;
    }
    createTag({
      variables: { name: tagName }
    });
  };

  // Render tags when network call completes, otherwise render a circular progress
  const renderTags = () => {
    if (getAllTagsLoading || !data || !data.tags) {
      return <CircularProgress size={24} />;
    }

    const { tags } = data;

    return tags.map(
      tag =>
        tag && (
          <Chip
            clickable
            size="small"
            key={tag._id}
            label={tag.name}
            className={classes.tags}
            color={isSelected(tag._id) ? "primary" : "default"}
            variant={isSelected(tag._id) ? "filled" : "outlined"}
            onClick={handleTagChange(tag)}
          />
        )
    );
  };

  return (
    <div className={classes.container}>
      <NewTagInput onSubmit={handleCreateTag} loading={createTagLoading} />
      {renderTags()}
      {createTagLoading && <CircularProgress size={18} />}
    </div>
  );
};

export default React.memo(TagRow);
