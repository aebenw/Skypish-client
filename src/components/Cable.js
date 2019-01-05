import React, { Fragment } from 'react';
import { ActionCable } from 'react-actioncable-provider';

const Cable = ({ conversations, handleReceivedMessage, handleReceivedVideo }) => {
  return (
    <Fragment>
      {conversations.map(conversation => {
        return (
          <div key={conversation.id}>

          <ActionCable
            key={conversation.id}
            channel={{ channel: 'VideosChannel', conversation: conversation.id }}
            onReceived={handleReceivedVideo}
          />

          <ActionCable
            key={"m" + conversation.id}
            channel={{ channel: 'MessagesChannel', conversation: conversation.id }}
            onReceived={handleReceivedMessage}
          />
        </div>
        );
      })}
    </Fragment>
  );
};

export default Cable;
