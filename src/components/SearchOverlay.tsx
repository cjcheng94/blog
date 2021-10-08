import React from "react";

type Props = {
  open: boolean;
};

const SearchOverlay: React.FC<Props> = ({ open }) => {
  if (!open) {
    return null;
  }
  return <div>Something wicked this way comes</div>;
};

export default SearchOverlay;
