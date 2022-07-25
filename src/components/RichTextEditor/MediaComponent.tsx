import React, { useState, useEffect } from "react";
import useGetImageUrl from "../../utils/useGetImageUrl";
import { imageMapVar } from "../../api/cache";

const imgStyle = {
  display: "block",
  marginLeft: "auto",
  marginRight: "auto",
  width: "80%"
};

const getUrlFromArrayBuffer = (arrayBuffer: ArrayBuffer) => {
  const arrayBufferView = new Uint8Array(arrayBuffer);
  const blob = new Blob([arrayBufferView]);
  return URL.createObjectURL(blob);
};

const MediaComponent: React.FC = ({ blockProps }: any) => {
  const [isLocalImage, setIsLocalImage] = useState(true);
  const [imageUrl, setImageUrl] = useState("");

  const { id } = blockProps;

  // Get image from S3 bucket by file ID via custom hook
  const { loading, failed, data } = useGetImageUrl(id);

  useEffect(() => {
    const imgMap = imageMapVar();
    // There is such an ID in the imgMap object, which means this image was
    // just added by the user, and dosen't yet exist on the backend
    const isLocal = Object.keys(imgMap).includes(id);
    setIsLocalImage(isLocal);

    // Local image, we generate an object url to display it locally
    if (isLocal) {
      const url = getUrlFromArrayBuffer(imgMap[id]);
      setImageUrl(url);
    }

    return () => {
      // Revoke img url on unmount
      URL.revokeObjectURL(imageUrl);
    };
  }, []);

  // Not local image, use the url from the backend
  useEffect(() => {
    if (isLocalImage) {
      return;
    }
    if (data) {
      setImageUrl(data);
    }
  }, [data]);

  if (!isLocalImage && loading) {
    return <div>Loading image...</div>;
  }

  if (!isLocalImage && failed) {
    return <div>Failed to get image</div>;
  }

  if (imageUrl) {
    return <img src={imageUrl} style={imgStyle} />;
  }

  return null;
};

export default MediaComponent;
