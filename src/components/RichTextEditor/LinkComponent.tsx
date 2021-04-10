import React from "react";
import { ContentState } from "draft-js";
import Link from "@material-ui/core/Link";

type Props = {
  contentState: ContentState;
  entityKey: string;
  children: React.ReactNode;
};

const LinkComponent: React.FC<Props> = props => {
  const { contentState, entityKey, children } = props;
  const { url } = contentState.getEntity(entityKey).getData();
  return (
    <Link href={url} target="_blank" rel="noopener">
      {children}
    </Link>
  );
};

export default LinkComponent;
