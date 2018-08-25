import React from "react";
import { DiscussionEmbed, CommentCount } from 'disqus-react';

export default class DisqueComment extends React.Component {
  render() {
    const disqusShortname = "alexreactblog";
    const disqusConfig = {
      url: this.props.url,
      identifier: this.props.id,
      title: this.props.title
    };

    return (
      <div className="comments">
        <div className='divider' style={{marginTop: '40px'}}></div>
        <CommentCount shortname={disqusShortname} config={disqusConfig}>
          Comments
        </CommentCount>
        <DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
    );
  }
}
