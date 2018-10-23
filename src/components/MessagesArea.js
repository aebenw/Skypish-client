
import React, { Fragment } from 'react';
import NewMessageForm from './NewMessageForm';

const MessagesArea = ({user_id, username, conversation: { id, title, messages, receiver: {name, receiver_id} }, }) => {
  console.log("message area props")
  return (

  <Fragment>
    <h2> Messages </h2>

    <div className="messagesArea">
      <h2>{title}</h2>
      <ul>{orderedMessages(messages, user_id)}</ul>
      <NewMessageForm conversation_id={id} user_id={user_id} />
    </div>
    <button onClick={(event) => {handleOnClick(event,id,user_id)}}>VIDEO!!!</button>
  </Fragment>
  );
};

export default MessagesArea;

// helpers

const handleOnClick = (event,otherId,UserId) => {
  return console.log(event,otherId,UserId)
}

const orderedMessages = (messages, user) => {
  const sortedMessages = messages.sort(
    (a, b) => new Date(a.created_at) - new Date(b.created_at)
  );
  return sortedMessages.map(message => {

    // if ()
    return <li key={message.id}>{message.text}</li>;
  });
};
