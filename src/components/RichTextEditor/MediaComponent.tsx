import React, { useState, useEffect } from "react";
import { getImage } from "../../api/aws";

const MediaComponent: React.FC = ({ blockProps }: any) => {
  const [imgUrl, seImageUrl] = useState("");

  // Get image from S3 bucket by file ID
  useEffect(() => {
    const { id } = blockProps;

    const loadImage = async () => {
      const imgUrl = await getImage(id);
      seImageUrl(imgUrl);
    };

    loadImage();
  }, []);

  const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%"
  };

  if (imgUrl) {
    return <img src={imgUrl} style={imgStyle} />;
  }
  return null;
};

export default MediaComponent;
