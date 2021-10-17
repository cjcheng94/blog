import React from "react";
import { Chip, CircularProgress, makeStyles } from "@material-ui/core";
import { useQuery } from "@apollo/client";
import { GET_ALL_TAGS } from "../gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%"
  },
  tags: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

const mockTags = [
  {
    _id: "1",
    name: "Ramdom"
  },
  {
    _id: "11",
    name: "Test"
  },
  {
    _id: "12",
    name: "Poetry"
  },
  {
    _id: "13",
    name: "Translation"
  },
  {
    _id: "14",
    name: "Prose"
  },
  {
    _id: "15",
    name: "Exposé"
  },
  {
    _id: "133",
    name: "Clickbait"
  },
  {
    _id: "124r",
    name: "News, Fake"
  },
  {
    _id: "112",
    name: "Hit Piece"
  },
  {
    _id: "145",
    name: "Tutorial"
  },
  {
    _id: "525",
    name: "Diary"
  },
  {
    _id: "143",
    name: "Mock"
  },
  {
    _id: "431",
    name: "Lyric"
  }
];
mockTags;
type TagRowProps = {
  editable: boolean;
  tagList?: Tag[];
  onChange?: (tag: Tag) => void;
  selectedTagIds?: string[];
};

const TagRow: React.FC<TagRowProps> = ({
  editable,
  tagList,
  onChange,
  selectedTagIds
}) => {
  const { data, loading } = useQuery(GET_ALL_TAGS);
  const classes = useStyles();

  if (loading) {
    return <CircularProgress />;
  }

  const { tags } = data;

  const handleTagChange = (tag: Tag) => () => {
    if (editable && onChange) {
      return onChange(tag);
    }
  };

  const isSelected = (id: string) => {
    if (!editable || !selectedTagIds) {
      return false;
    }
    return selectedTagIds.includes(id);
  };

  return (
    <div className={classes.container}>
      {tags.map((tag: Tag) => (
        <Chip
          size="small"
          key={tag._id}
          label={tag.name}
          className={classes.tags}
          clickable={editable ? true : false}
          color={isSelected(tag._id) ? "primary" : "default"}
          variant={isSelected(tag._id) ? "default" : "outlined"}
          onClick={handleTagChange(tag)}
        />
      ))}
    </div>
  );
};

export default TagRow;
