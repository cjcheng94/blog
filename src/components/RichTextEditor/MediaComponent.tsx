import React, { useEffect } from "react";
import useGetImageUrl from "../../utils/useGetImageUrl";
import useUploadImage from "../../utils/useUploadImage";
import { imageMapVar } from "../../api/cache";
import { LinearProgress, makeStyles } from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  centeredBlock: {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%"
  },
  localChildren: {
    width: "100%"
  },
  errorMessage: {
    color: theme.palette.error.main
  }
}));

const getUrlFromArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  const arrayBufferView = new Uint8Array(arrayBuffer);
  const blob = new Blob([arrayBufferView]);
  return URL.createObjectURL(blob);
};

const LocalImage: React.FC = ({ blockProps }: any) => {
  const classes = useStyles();

  const { id } = blockProps;
  const imgMap = imageMapVar();
  const imgArrayBuffer = imgMap[id];

  // Local image, we generate an object url to display it locally
  const imgUrl = getUrlFromArrayBuffer(imgArrayBuffer);

  // Upload image via custom hook
  const { loading, failed } = useUploadImage({
    fileId: id,
    file: imgArrayBuffer
  });

  useEffect(() => {
    return () => {
      // Revoke img url on unmount
      URL.revokeObjectURL(imgUrl);
    };
  }, []);

  if (imgUrl) {
    return (
      <div className={classes.centeredBlock}>
        <img src={imgUrl} className={classes.localChildren} />
        {loading && <LinearProgress className={classes.localChildren} />}
        {failed && (
          <div className={classes.errorMessage}>
            Image upload failed, please try again
          </div>
        )}
      </div>
    );
  }

  return null;
};

const RemoteImage: React.FC = ({ blockProps }: any) => {
  const classes = useStyles();

  const { id } = blockProps;
  // // Get image from S3 bucket by file ID via custom hook
  const { loading, failed, data: imgUrl } = useGetImageUrl(id);

  useEffect(() => {
    return () => {
      // Revoke img url on unmount
      URL.revokeObjectURL(imgUrl);
    };
  }, []);

  if (loading) {
    return <div>Loading image...</div>;
  }

  if (failed) {
    return <div>Failed to get image</div>;
  }

  if (imgUrl) {
    return <img src={imgUrl} className={classes.centeredBlock} />;
  }

  return null;
};

// Calculate if this image is local, i.e., did the user just added this image when writing/editing.
// if it is local, we generate an object url and upload the image,
// otherwise, we simply get the image from the backend and display it
const MediaComponent: React.FC = (props: any) => {
  const { id } = props.blockProps;
  const imgMap = imageMapVar();
  // There is such an ID in the imgMap object, which means this image was
  // just added by the user, and dosen't yet exist on the backend
  const isLocal = Object.keys(imgMap).includes(id);

  if (isLocal) {
    return <LocalImage {...props} />;
  }
  return <RemoteImage {...props} />;
};

export default MediaComponent;
