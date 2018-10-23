
import React, { Fragment } from 'react';
import NewMessageForm from './NewMessageForm';

var Peer = require('simple-peer')

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
    <button onClick={() => {handleOnClick()}}>VIDEO!!!</button>
  </Fragment>
  );
};

export default MessagesArea;

// helpers

const handleOnClick = () => {
  navigator.getUserMedia({ video: true, audio: true }, gotMedia, function () {})
}

function gotMedia(stream){
  var peer1 = new Peer({ initiator: true, stream: stream })
  var peer2 = new Peer()

  peer1.on('signal', function (data) {
  peer2.signal(data)
})


  peer2.on('signal', function (data) {
  peer1.signal(data)
  })

  peer2.on('stream', function (stream) {
    var video = document.querySelector('video')
    video.src = window.URL.createObjectURL(stream)
    video.play()
  })


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
