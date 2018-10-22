import React from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT } from '../constants';
import NewConversationForm from './NewConversationForm';
import MessagesArea from './MessagesArea';
import Cable from './Cable';
import UsersContainer from './UsersContainer'

class ConversationsList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    conversations: props.user.conversations,
    activeConversation: null,
    users:[]
  }
}

  componentDidMount = () => {
    fetch(`http://localhost:3001/users`)
      .then(res => res.json())
      .then(users => this.setState({users:users}));
  };

  handleClick = id => {
    this.setState({ activeConversation: id });
  };

  handleReceivedConversation = response => {
    const { conversation } = response;
    this.setState({
      conversations: [...this.state.conversations, conversation]
    });
  };

  handleReceivedMessage = response => {
    const { message } = response;
    const conversations = [...this.state.conversations];
    const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    );
    conversation.messages = [...conversation.messages, message];
    this.setState({ conversations });
  };

  handleUsersClick = (obj) => {
    fetch("http://localhost:3001/followers",{
      method: "POST",
      headers:{
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({currentU:this.props.user.name,otherU:obj.name})
    })

  }

  render = () => {
    const { conversations, activeConversation } = this.state;
    console.log(this.state.users)
    return (
      <div className="conversationsList">
        <UsersContainer users={this.state.users} handleUsersClick={this.handleUsersClick} />
        <ActionCable
          channel={{ channel: 'ConversationsChannel' }}
          onReceived={this.handleReceivedConversation}
        />
        {this.state.conversations.length ? (
          <Cable
            conversations={conversations}
            handleReceivedMessage={this.handleReceivedMessage}
          />
        ) : null}
        <h2>Conversations</h2>
        <ul>{mapConversations(conversations, this.handleClick, this.props.user.name)}</ul>
        <NewConversationForm />
        {activeConversation ? (
          <MessagesArea
            conversation={findActiveConversation(
              conversations,
              activeConversation
            )}
          />
        ) : null}
      </div>
    );
  };
}

export default ConversationsList;

// helpers

const findActiveConversation = (conversations, activeConversation, name) => {
  return conversations.find(
    conversation => conversation.id === activeConversation
  );
};

const mapConversations = (conversations, handleClick, name) => {
  return conversations.map(conversation => {
    if (conversation.receiver.name === name){
    return (
      <li key={conversation.id} onClick={() => handleClick(conversation.id)}>
        {conversation.author.name}
      </li>
    )} else {
      return (
        <li key={conversation.id} onClick={() => handleClick(conversation.id)}>
          {conversation.receiver.name}
        </li>

    );
  }
})
};
