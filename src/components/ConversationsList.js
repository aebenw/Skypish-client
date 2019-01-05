import React,{Fragment, Component} from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT, ICE, HEADERS } from '../constants';

import ConversationsCont from '../containers/ConversationsCont'
import MessagesArea from './messages/MessagesArea';
import EmptyMessage from './messages/EmptyMessage';

import Cable from './Cable';
import UserContainer from '../containers/UserContainer'
import VideoContainer from '../containers/VideoContainer'
import Header from './Header'
import SideBar from '../containers/SideBar'

class ConversationsList extends Component {
  constructor(props){
    super(props)
    this.state = {
    conversations: props.user.conversations,
    user_id: this.props.user.id,
    username: this.props.user.name,
    activeConversation: null,
    users:this.props.user.inactive,
    pcPeers: {},
    localstream: '',
    conversationId: '',
    active: true
  }
}

  handleClick = id => {
    this.setState({ activeConversation: id });
  };

  changeSideBar = (turnary) => {
    this.setState({
      active: turnary
    })
  }

  handleUsersClick = (obj) => {
    let copy = [...this.state.users]
    copy = copy.filter(user => user.id !== obj.id)
    this.setState({
      users: copy
    })


    fetch(API_ROOT+"/followers",{
      method: "POST",
      headers:{'Content-Type': 'application/json'},
      body: JSON.stringify({currentU:this.props.user.name,otherU:obj.name})
    })

  }

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
      .getUserMedia({ video: { width: 400, height: 300 }, audio: true })
      .then(stream => {
        localVideo.srcObject = stream;
          localVideo.muted = true;
          this.setLocalStream(stream)
        })
        .then(() => this.createPC(data.from, true))
  };

  createPC = (userId, isOffer) => {

  const EXCHANGE = "EXCHANGE";
  const REMOVE_USER = "REMOVE_USER";
  let friendVideo = document.getElementById('friend-video')
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
    friendVideo.appendChild(element);
  };

  pc.oniceconnectionstatechange = event => {
    if (pc.iceConnectionState === "disconnected") {
      // console.log("Disconnected:", userId);
      this.broadcastData({video:{
        conversation_id: this.state.conversationId,
        user_id: this.state.user_id,
        type: REMOVE_USER,
        from: userId
      }});
    }
  };
  // console.log("pc obj outside of function", pc)
  this.setState({
    pcPeers: connectObj
  })
  return pc;
};

 exchange = data => {

  let pc;
  if (!this.state.pcPeers[data.from]) {
    pc = this.createPC(data.from, false);
  } else {
    pc =  this.state.pcPeers[data.from];
  }

  if (data.candidate) {
    // debugger
    let iceCand = new RTCIceCandidate(JSON.parse(data.candidate))
    pc
      .addIceCandidate(iceCand)
      .then(resp => {
        return this.setState({pcPeers: { [data.from]: resp} })
      })
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
    const { conversations, activeConversation, user_id, username, active } = this.state;
    return (
      <Fragment>
        <div className="container-fluid">
          <Header />
          <SideBar changeView={this.changeSideBar} />

          <div className="row">
            {active ?
            <ConversationsCont conversations={conversations} handleClick={this.handleClick} name={this.props.user.name} />
            :
             <UserContainer users={this.state.users} handleUsersClick={this.handleUsersClick} />
            }

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

            {activeConversation ? (
              <MessagesArea
                conversation={findActiveConversation(
                  conversations,
                  activeConversation
                )} user_id={user_id} username={username} setLocalStream={this.setLocalStream}
              />
            ) : <EmptyMessage />}

          </div>
        </div>

        <VideoContainer />

  </Fragment>
    );
  };
}

export default ConversationsList;


const findActiveConversation = (conversations, activeConversation, name) => {
  return conversations.find(
    conversation => conversation.id === activeConversation
  );
};
