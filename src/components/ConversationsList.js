import React from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT, ICE, HEADERS } from '../constants';
import NewConversationForm from './NewConversationForm';
import MessagesArea from './MessagesArea';
import Cable from './Cable';
import UsersContainer from '../containers/UsersContainer'
import VideoContainer from '../containers/VideoContainer'

class ConversationsList extends React.Component {
  constructor(props){
    super(props)
    this.state = {
    conversations: props.user.conversations,
    user_id: this.props.user.id,
    username: this.props.user.name,
    activeConversation: null,
    users:[],
    pcPeers: {},
    localstream: '',
    conversationId: ''
  }
}



  componentDidMount = () => {
    fetch(API_ROOT+`/users`)
      .then(res => res.json())
      .then(users => this.setState({users:users}, () => console.log("all users", this.state.users)));

      let localVideo = document.getElementById("local-video");


        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
            .then(stream => {
              localVideo.srcObject = stream;
              localVideo.muted = true;
              this.setLocalStream(stream)
            })


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
    const JOIN_ROOM = "JOIN_ROOM";
    const EXCHANGE = "EXCHANGE";
    const REMOVE_USER = "REMOVE_USER";

    if (message.kind) {
      this.setState({conversationId: message.conversation_id})
      if (message.from == this.state.user_id) return;
      switch (message.kind) {
        case JOIN_ROOM:
          return this.joinRoom(message);
        case EXCHANGE:
          if (message.to !== this.state.user_id) return;
          return this.exchange(message);
        case REMOVE_USER:
          return this.removeUser(message);
        default:
          return;
        }
    } else {
      const conversations = [...this.state.conversations];
      const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    );
    conversation.messages = [...conversation.messages, message];
    this.setState({ conversations });
    };
  }

  joinRoom = data => {
    this.createPC(data.from, true);
  };

  createPC = (userId, isOffer) => {
  const JOIN_ROOM = "JOIN_ROOM";
  const EXCHANGE = "EXCHANGE";
  const REMOVE_USER = "REMOVE_USER";
  let videoContainer = document.getElementById('videocontainer')
  let connectObj = {}
  let pc = new RTCPeerConnection({
    iceServers:
    [
      {
        urls: "stun:stun.l.google.com:19302"
      }
    ]
  });
  connectObj[userId] = pc;
  pc.addStream(this.state.localstream.stream);

  console.log("pc obj", pc)
  console.log("pcpeers obj", connectObj)

  isOffer &&
    pc
      .createOffer()
      .then(offer => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        this.broadcastData({message:{
          type: EXCHANGE,
          from: this.state.user_id,
          to: userId,
          conversation_id: this.state.conversationId,
          sdp: JSON.stringify(pc.localDescription)
        }});
      })

      console.log("before onicecanidate")
  pc.onicecandidate = event => {
    event.candidate &&
      this.broadcastData({message: {
        type: EXCHANGE,
        from: this.state.user_id,
        to: userId,
        conversation_id: this.state.conversationId,
        candidate: JSON.stringify(event.candidate)
      }});
  };

  console.log("before onaddstream")
  pc.onaddstream = event => {
    debugger
    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;
    element.autoplay = "autoplay";
    element.srcObject = event.stream;
    videoContainer.appendChild(element);
  };

  pc.oniceconnectionstatechange = event => {
    if (pc.iceConnectionState === "disconnected") {
      console.log("Disconnected:", userId);
      this.broadcastData({message:{
        type: REMOVE_USER,
        from: userId,
        conversation_id: this.state.conversationId
      }});
    }
  };

  return pc;
};

 exchange = data => {
  let pc;
  let connectObj = {}
  debugger
  if (!this.state.pcPeers[data.from]) {
    pc = this.createPC(data.from, false);
  } else {
    pc = connectObj[data.from];
  }

  if (data.candidate) {
    pc
      .addIceCandidate(new RTCIceCandidate(JSON.parse(data.candidate)))
      .then(() => console.log("Ice candidate added"))
  }

  if (data.sdp) {
    let sdp = JSON.parse(data.sdp);
    pc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer);
          }).then(()=> {
            this.broadcastData({message:{
              type: 'EXCHANGE',
              conversation_id: this.state.conversationId,
              from: this.state.user_id,
              to: data.from,
              sdp: JSON.stringify(pc.localDescription)
            }});
          });
        }
      })
  }
};

  handleUsersClick = (obj) => {
    fetch(API_ROOT+"/followers",{
      method: "POST",
      headers:{
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({currentU:this.props.user.name,otherU:obj.name})
    })

  }

  setLocalStream = (stream) => {
    this.setState({ localstream: {stream} })
    console.log(this.state.localstream)
  }

  broadcastData = data => {
  fetch(API_ROOT + "messages", {
    method: "POST",
    body: JSON.stringify(data),
    headers: HEADERS
  });
  };

  render = () => {
    const { conversations, activeConversation, user_id, username } = this.state;
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
        {/* <NewConversationForm /> */}
        {activeConversation ? (
          <MessagesArea
            conversation={findActiveConversation(
              conversations,
              activeConversation
            )} user_id={user_id} username={username} setLocalStream={this.setLocalStream}
          />
        ) : null}
        <div id="videocontainer">
        <VideoContainer handleJoinSession={this.handleJoinSession} handleLeaveSession={this.handleLeaveSession} />
      </div>
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
