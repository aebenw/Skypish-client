
import React from 'react';
import NewMessageForm from './NewMessageForm';

const MessagesArea = ({user_id, username, conversation: { id, title, messages, receiver: {name, receiver_id} }}) => {
  console.log("message area props")
  return (
    <div className="messagesArea">
      <h2>{title}</h2>
      <ul>{orderedMessages(messages, user_id)}</ul>
      <NewMessageForm conversation_id={id} user_id={user_id} />
    </div>
  );
};

export default MessagesArea;

// helpers

const orderedMessages = (messages, user) => {
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedMessages.map(message => {

    // if ()
    return <li key={message.id}>{message.text}</li>;
  });
};
