import React from 'react';


const ConversationsCont = ({conversations, handleClick, name}) => {
    return (
          <div class="conversation-wrap col-lg-3">
              {mapConversations(conversations, handleClick, name)}
          </div>


    )
}

const mapConversations = (conversations, handleClick, name) => {
  return conversations.map(conversation => {
    if (conversation.receiver.name === name){
      return (
        <div class="media conversation">
          <div key={conversation.id} onClick={() => handleClick(conversation.id)} class="media-body">
              <h5 class="media-heading">{conversation.author.name}</h5>
              {/* <small>Hello</small> */}
          </div>
        </div>
      )
    } else {
      return (
        <div class="media conversation">
          <div key={conversation.id} onClick={() => handleClick(conversation.id)} class="media-body">
              <h5 class="media-heading">{conversation.receiver.name}</h5>
              {/* <small>Hello</small> */}
          </div>
        </div>
      )
    }
  })
};



export default ConversationsCont
