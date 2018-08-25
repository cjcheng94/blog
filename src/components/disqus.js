import React from "react";
import { DiscussionEmbed } from 'disqus-react';
import keys from '../config/keys';

export default class DisqueComment extends React.Component {
  render() {
    const disqusShortname = keys.DISQUS_SHORTNAME;
    const disqusConfig = {
      url: window.location.href,
      identifier: this.props.id,
      title: this.props.title
    };
    console.log(disqusShortname);
    console.log(disqusConfig.url);
    
    
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
