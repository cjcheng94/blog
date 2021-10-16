import React from "react";
import {
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  CircularProgress,
  makeStyles
} from "@material-ui/core";
import { ExpandMore } from "@material-ui/icons";
import { useQuery } from "@apollo/client";
import { GET_ALL_TAGS } from "../gqlDocuments";
import { Tag } from "PostTypes";

const useStyles = makeStyles(theme => ({
  container: {
    width: "100%",
    marginBottom: theme.spacing(1)
  },
  accordion: {
    border: `1px solid ${theme.palette.divider}`
  },
  tags: {
    marginRight: theme.spacing(1),
    marginBottom: theme.spacing(1)
  }
}));

type TagsProps = {
  editable: boolean;
  tagList?: Tag[];
  onChange?: (tag: Tag) => void;
  selectedTagIds?: string[];
};

const Tags: React.FC<TagsProps> = ({ editable, onChange, selectedTagIds }) => {
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
    <>
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
    </>
  );
};

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
  const classes = useStyles();

  return (
    <div className={classes.container}>
      <Accordion className={classes.accordion}>
        <AccordionSummary expandIcon={<ExpandMore />}>Tags</AccordionSummary>
        <AccordionDetails>
          <div>
            <Tags
              editable={editable}
              onChange={onChange}
              selectedTagIds={selectedTagIds}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};

export default TagRow;
