import React from "react";
import { DiscussionEmbed } from 'disqus-react';

export default class DisqueComment extends React.Component {
  render() {
    const disqusShortname = "alexreactblog"
    const disqusConfig = {
      url: window.location.href,
      identifier: this.props.id,
      title: this.props.title
    };    
    
    return (
      <div className="comments">
        <div className='divider' style={{marginTop: '120px'}}></div>
        <DiscussionEmbed
          shortname={disqusShortname}
          config={disqusConfig}
        />
      </div>
    );
  }
}
