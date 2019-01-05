import React from 'react';


const ConversationsCont = ({conversations, handleClick, name}) => {
    return (
          <div className="conversation-wrap col-lg-3">
              {mapConversations(conversations, handleClick, name)}
          </div>


    )
}

const mapConversations = (conversations, handleClick, name) => {
  return conversations.map(conversation => {
    if (conversation.receiver.name === name){
      return (
        <div key={conversation.id} className="media conversation">
          <div onClick={() => handleClick(conversation.id)} className="media-body">
              <h5 className="media-heading">{conversation.author.name}</h5>
          </div>
        </div>
      )
    } else {
      return (
        <div key={conversation.id} className="media conversation">
          <div  onClick={() => handleClick(conversation.id)} class="media-body">
              <h5 className="media-heading">{conversation.receiver.name}</h5>
          </div>
        </div>
      )
    }
  })
};



export default ConversationsCont
