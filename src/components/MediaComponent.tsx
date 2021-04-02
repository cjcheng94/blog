import React from "react";

const MediaComponent: React.FC = ({ blockProps }: any) => {
  const src = blockProps.src;
  const imgStyle = {
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
    width: "80%"
  };

  if (src.file) {
    return <img src={src.file} style={imgStyle} />;
  }
  return null;
};

export default MediaComponent;
