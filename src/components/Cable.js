import React, { Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';

const Cable = ({ conversations, handleReceivedMessage, handleReceivedVideo }) => {
  return (
    <Fragment>
      {conversations.map(conversation => {
        return (
          <Fragment>

          <ActionCable
            key={conversation.id}
            channel={{ channel: 'VideosChannel', conversation: conversation.id }}
            onReceived={handleReceivedVideo}
          />
          </Fragment>
        );
      })}
    </Fragment>
  );
};

export default Cable;
