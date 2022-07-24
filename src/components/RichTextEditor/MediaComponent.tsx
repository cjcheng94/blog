import React, { useState, useEffect } from "react";
import { getImage } from "../../api/aws";

const MediaComponent: React.FC = ({ blockProps }: any) => {
  const { id, localImageUrl } = blockProps;
  const [imgUrl, seImageUrl] = useState("");

  // Get image from S3 bucket by file ID
  useEffect(() => {
    const loadImage = async () => {
      const imgUrl = await getImage(id);
      seImageUrl(imgUrl);
    };
    loadImage();

    return () => {
      // Revoke img url on unmount
      URL.revokeObjectURL(imgUrl);
    };
  }, []);

  const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%"
  };

  // Use localImageUrl to display the image when we're editing the post;
  // use imgUrl generated from network request when we're viewing the post later,
  // i.e.: the image exists on the backend
  if (imgUrl || localImageUrl) {
    return <img src={imgUrl || localImageUrl} style={imgStyle} />;
  }
  return null;
};

export default MediaComponent;
