import React from 'react';
import { API_ROOT, HEADERS } from '../constants';
import NewMessageForm from './NewMessageForm';


export default class MessagesArea extends React.Component {
    // {user_id, username, conversation: { id, title, messages, receiver: {name, receiver_id}}} = this.props

  constructor(props){
    super(props)
    this.state = {
      user_id: this.props.user_id,
      username: this.props.username,
      conversationId: this.props.conversation.id,
      conversationTitle: this.props.conversation.title,
      messages: this.props.conversation.messages,
      recieverName: this.props.conversation.recieverName,
      recieverId: this.props.conversation.reciever_Id

    }
  }

   handleOnClick = () => {

    let localVideo = document.getElementById("local-video");


    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideo.srcObject = stream;
          localVideo.muted = true;
          this.props.setLocalStream(stream)
        }).then(() => this.makeOffer())
    }


    makeOffer = () => {
    const JOIN_ROOM = "JOIN_ROOM";

    const data = { video: {
      kind: JOIN_ROOM,
      user_id: this.state.user_id,
      from: this.state.user_id,
      conversation_id: this.state.conversationId
    }
    }

    fetch(API_ROOT + "/videos", {
      method: "POST",
      headers: HEADERS,
      body: JSON.stringify(data)
    })

  }



   orderedMessages = (messages, user) => {
    const sortedMessages = messages.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
    return sortedMessages.map(message => {
      return <li key={message.id}>{message.text}</li>;
    })
  }

  render() {
    const {user_id, username, conversationId, conversationTitle, messages, receiverName, receiverId} = this.state
  return (
    <React.Fragment>
      <h2> Messages </h2>
      <div className="messagesArea">
        <h2>{conversationTitle}</h2>
        <ul>{this.orderedMessages(this.props.conversation.messages, user_id)}</ul>
        <NewMessageForm conversation_id={conversationId} user_id={user_id} />
      </div>
      <button onClick={() => {this.handleOnClick()}}>VIDEO!!!</button>
    </React.Fragment>
    )
  }
}

// helpers
