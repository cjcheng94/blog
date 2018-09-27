import React from "react";
import { DiscussionEmbed } from "disqus-react";

import Divider from "@material-ui/core/Divider";

export default props => {
  const disqusShortname = "alexreactblog";
  const disqusConfig = {
    url: window.location.href,
    identifier: props.id,
    title: props.title
  };

  return (
    <div className="comments">
      <Divider style={{ margin: "40px 0" }} />
      <small>
        Comments powered by Disqus (需梯子访问)
        <span role="img" aria-label="smilling emoji">
          😀
        </span>
      </small>
      <DiscussionEmbed shortname={disqusShortname} config={disqusConfig} />
    </div>
  );
};
