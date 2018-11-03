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
    conversationId: '',
  }
}



  componentDidMount = () => {
    fetch(API_ROOT+`/users`)
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
    debugger
    const { message } = response;

    const conversations = [...this.state.conversations];
    const conversation = conversations.find(
      conversation => conversation.id === message.conversation_id
    );
    conversation.messages = [...conversation.messages, message];
    this.setState({ conversations });
    };

  handleReceivedVideo = response => {

    const { video } = response;

    const JOIN_ROOM = "JOIN_ROOM";
    const EXCHANGE = "EXCHANGE";
    const REMOVE_USER = "REMOVE_USER";
      this.setState({conversationId: video.conversation_id})
      if (video.from == this.state.user_id) return;
      switch (video.kind) {
        case JOIN_ROOM:
          return this.joinRoom(video);
        case EXCHANGE:
          if (video.to !== this.state.user_id) return;
          return this.exchange(video);
        case REMOVE_USER:
          return this.removeUser(video);
        default:
          return;
        }
  }


  joinRoom = data => {

    let localVideo = document.getElementById("local-video");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then(stream => {
        localVideo.srcObject = stream;
          localVideo.muted = true;
          this.setLocalStream(stream)
        }).then(()=> console.log("set local stream check", this.state))
        .then(() => this.createPC(data.from, true))
  };

  createPC = (userId, isOffer) => {

  const JOIN_ROOM = "JOIN_ROOM";
  const EXCHANGE = "EXCHANGE";
  const REMOVE_USER = "REMOVE_USER";
  let videoContainer = document.getElementById('videocontainer')
  let pc = new RTCPeerConnection(ICE);
  let connectObj = {}
  connectObj[userId] = pc;
  pc.addStream(this.state.localstream.stream);

  isOffer &&
    pc
      .createOffer()
      .then(offer => {
        return pc.setLocalDescription(offer);
      }).then(() => {
        this.broadcastData({video:{
          conversation_id: this.state.conversationId,
          kind: EXCHANGE,
          from: this.state.user_id,
          user_id: this.state.user_id,
          to: userId,
          sdp: JSON.stringify(pc.localDescription)
        }});
      })

  pc.onicecandidate = event => {
    // debugger
    event.candidate &&
      this.broadcastData({video: {
        conversation_id: this.state.conversationId,
        kind: EXCHANGE,
        from: this.state.user_id,
        user_id: this.state.user_id,
        to: userId,
        candidate: JSON.stringify(event.candidate)
      }});
  };

  pc.onaddstream = event => {

    const element = document.createElement("video");
    element.id = `remoteVideoContainer+${userId}`;
    element.autoplay = "autoplay";
    element.srcObject = event.stream;
    videoContainer.appendChild(element);
  };

  pc.oniceconnectionstatechange = event => {
    if (pc.iceConnectionState === "disconnected") {
      console.log("Disconnected:", userId);
      this.broadcastData({video:{
        conversation_id: this.state.conversationId,
        user_id: this.state.user_id,
        type: REMOVE_USER,
        from: userId
      }});
    }
  };
  console.log("pc obj outside of function", pc)
  this.setState({
    pcPeers: connectObj
  }, () => console.log(this.state))
  // debugger
  return pc;
};

 exchange = data => {

  let pc;
  if (!this.state.pcPeers[data.from]) {
    // debugger
    pc = this.createPC(data.from, false);
  } else {
    pc =  this.state.pcPeers[data.from];
  }

  // debugger
  if (data.candidate) {
    let iceCand = new RTCIceCandidate(JSON.parse(data.candidate))
    pc
      .addIceCandidate(iceCand)
      .then(resp => this.setState({pcPeers: { [data.from]: resp} }))
        .then(console.log)
  }
  // debugger
  if (data.sdp) {
    let sdp = JSON.parse(data.sdp);
    pc
      .setRemoteDescription(new RTCSessionDescription(sdp))
      .then(() => {
        if (sdp.type === "offer") {
          pc.createAnswer().then(answer => {
            return pc.setLocalDescription(answer);
          }).then(()=> {
            this.broadcastData({video:{
              conversation_id: this.state.conversationId,
              kind: 'EXCHANGE',
              user_id: this.state.user_id,
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
  }

  broadcastData = data => {
  fetch(API_ROOT + "videos", {
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
            handleReceivedVideo={this.handleReceivedVideo}
          />

        ) : null}
        <h2>Conversations</h2>
        <ul>{mapConversations(conversations, this.handleClick, this.props.user.name)}</ul>
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
