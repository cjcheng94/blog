import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  makeStyles
} from "@material-ui/core";
import { useMutation } from "@apollo/client";
import { UPDATE_IMAGE, GET_IMAGE } from "../../api/gqlDocuments";

const useStyles = makeStyles(theme => ({
  input: {
    width: "100%"
  },
  errorMessage: {
    width: "100%",
    color: theme.palette.error.main
  }
}));

type Props = {
  imageId: string;
  onClose: () => void;
};
// We'd have to deal w/ Draft entities and add unnecessary complexities if we were to put an input in MediaComponent,
// Instead, we use a Dialog outside of the Draft editor, as the editor state should not care about the caption at all
const ImageCaptionDialog: React.FC<Props> = props => {
  const [value, setValue] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const classes = useStyles();

  const { onClose, imageId } = props;

  const [updateImage, { loading, error, data }] = useMutation(UPDATE_IMAGE, {
    refetchQueries: [{ query: GET_IMAGE, variables: { _id: imageId } }]
  });

  const handleClose = () => {
    setValue("");
    onClose();
  };

  useEffect(() => {
    if (!loading && data) {
      handleClose();
    }
  }, [loading, data]);

  const handleUpdate = () => {
    if (value.length > 180) {
      setErrorMessage("Caption text can't exceed 180 characters");
      return;
    }

    setErrorMessage("");
    updateImage({
      variables: {
        _id: imageId,
        caption: value
      }
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleUpdate();
    }
  };

  return (
    <Dialog open={true} onClose={handleClose}>
      <DialogTitle>Edit Caption</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          className={classes.input}
          value={value}
          onChange={e => {
            setValue(e.target.value);
          }}
          onKeyDown={handleKeyDown}
        />
        {errorMessage && (
          <div className={classes.errorMessage}>{errorMessage}</div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleUpdate} color="secondary" disabled={loading}>
          OK
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ImageCaptionDialog;
