import React,{Fragment} from 'react';
import { ActionCable } from 'react-actioncable-provider';
import { API_ROOT, ICE, HEADERS } from '../constants';

import ConversationsCont from '../containers/ConversationsCont'
import NewConversationForm from './NewConversationForm';
import MessagesArea from './MessagesArea';
import Cable from './Cable';
import UserContainer from '../containers/UserContainer'
import VideoContainer from '../containers/VideoContainer'

class ConversationsList extends React.Component {
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
  }
}




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
        }).then(()=> console.log("set local stream check", this.state))
        .then(() => this.createPC(data.from, true))
  };

  createPC = (userId, isOffer) => {

  const JOIN_ROOM = "JOIN_ROOM";
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
    friendVideo.appendChild(element);
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
        console.log(resp, "resp")
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

  handleUsersClick = (obj) => {
    // console.log(this.state)
    // debugger
    let copy = [...this.state.users]
    copy = copy.filter(user => user.id !== obj.id)
    this.setState({
      users: copy
    })


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
      <Fragment>
        <div class="container-fluid">
          <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
            <h1 class="h2">Skypish</h1>
            <div class="btn-toolbar mb-2 mb-md-0">
              <div class="btn-group mr-2">
                <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
                <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
              </div>
              <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                This week
              </button>
            </div>
          </div>
          <div class="row">
            <div class="col-lg-3">
                <div class="btn-panel btn-panel-conversation">
                    <a href="" class="btn  col-lg-6 send-message-btn " role="button"><i class="fa fa-search"></i> Search</a>
                    <a href="" class="btn  col-lg-6  send-message-btn pull-right" role="button"><i class="fa fa-plus"></i> New Message</a>
                </div>
            </div>
          </div>
          <div className="row">
            <ConversationsCont conversations={conversations} handleClick={this.handleClick} name={this.props.user.name} />
            {/* <UserContainer users={this.state.users} handleUsersClick={this.handleUsersClick} /> */}

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
            ) : null}
          </div>
        </div>









      <div id="videocontainer">
        <video  id="local-video"  autoPlay> </video>
      </div>

        <div id="friend-video">
        </div>

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



//------------------

  // render = () => {
    // const { conversations, activeConversation, user_id, username } = this.state;
    // return (
    //   <Fragment>
    //     <div class="container-fluid">
    //       <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
    //         <h1 class="h2">Dashboard</h1>
    //         <div class="btn-toolbar mb-2 mb-md-0">
    //           <div class="btn-group mr-2">
    //             <button type="button" class="btn btn-sm btn-outline-secondary">Share</button>
    //             <button type="button" class="btn btn-sm btn-outline-secondary">Export</button>
    //           </div>
    //           <button type="button" class="btn btn-sm btn-outline-secondary dropdown-toggle">
    //             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-calendar">
    //               <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    //               <line x1="16" y1="2" x2="16" y2="6"></line>
    //               <line x1="8" y1="2" x2="8" y2="6"></line>
    //               <line x1="3" y1="10" x2="21" y2="10"></line>
    //             </svg>
    //             This week
    //           </button>
    //         </div>
    //       </div>
    //       <div class="row">
    //         <UserContainer users={this.state.users} handleUsersClick={this.handleUsersClick} />
    //         <main role="main" class="col-md-9 ml-sm-auto col-lg-10 px-4">
    //           <div class="chartjs-size-monitor" style={{
    //               "position" : "absolute",
    //               "left" : "0px",
    //               "top" : "0px",
    //               "right" : "0px",
    //               "bottom" : "0px",
    //               "overflow" : "hidden",
    //               "pointer-events" : "none",
    //               "visibility" : "hidden",
    //               "z-index" : "-1"
    //             }}>
    //             <div class="chartjs-size-monitor-expand" style={{
    //                 "position" : "absolute",
    //                 "left" : "0",
    //                 "top" : "0",
    //                 "right" : "0",
    //                 "bottom" : "0",
    //                 "overflow" : "hidden",
    //                 "pointer-events" : "none",
    //                 "visibility" : "hidden",
    //                 "z-index" : "-1"
    //               }}>
    //               <div style={{
    //                   "position" : "absolute",
    //                   "width" : "1000000px",
    //                   "height" : "1000000px",
    //                   "left" : "0",
    //                   "top" : "0"
    //                 }}></div>
    //             </div>
    //             <div class="chartjs-size-monitor-shrink" style={{
    //                 "position" : "absolute",
    //                 "left" : "0",
    //                 "top" : "0",
    //                 "right" : "0",
    //                 "bottom" : "0",
    //                 "overflow" : "hidden",
    //                 "pointer-events" : "none",
    //                 "visibility" : "hidden",
    //                 "z-index" : "-1"
    //               }}>
    //               <div style={{
    //                   "position" : "absolute",
    //                   "width" : "200%",
    //                   "height" : "200%",
    //                   "left" : "0",
    //                   "top" : "0"
    //                 }}></div>
    //             </div>
    //           </div>
    //         </main>
    //       </div>
    //     </div>


        {/* <Grid>
        <Grid.Row columns={3} divided >
          <Grid.Column width={4}>

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
      </Grid.Column>

      <Grid.Column width={8} >
          {activeConversation ? (
            <MessagesArea
              conversation={findActiveConversation(
                conversations,
                activeConversation
              )} user_id={user_id} username={username} setLocalStream={this.setLocalStream}
            />
          ) : <h1>Message Area</h1>}
        </Grid.Column>



      <Grid.Column width={4} >
        <h2>Conversations</h2>
        <ul>{mapConversations(conversations, this.handleClick, this.props.user.name)}</ul>
        </Grid.Column>
      </Grid.Row>

    <Grid.Row columns={2}>
      <Grid.Column >
      <div id="videocontainer">
        <video  id="local-video"  autoPlay> </video>
      </div>
    </Grid.Column>
      <Grid.Column >
        <div id="friend-video">
        </div>

      </Grid.Column>

    </Grid.Row>
  </Grid> */}
    {/* <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script>
      window.jQuery || document.write('<script src="/docs/4.2/assets/js/vendor/jquery-slim.min.js"></script>')
    </script>
    <script src="/docs/4.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-zDnhMsjVZfS3hiP7oCBRmfjkQC4fzxVxFhBx8Hkz2aZX8gEvA/jsP3eXRCvzTofP" crossorigin="anonymous"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/feather-icons/4.9.0/feather.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.7.3/Chart.min.js"></script>
    <script src="dashboard.js"></script>
  </Fragment>
    );
  }; */}

  //-----------------

// import React from 'react';
// import { ActionCable } from 'react-actioncable-provider';
// import { API_ROOT, ICE, HEADERS } from '../constants';
// import NewConversationForm from './NewConversationForm';
// import MessagesArea from './MessagesArea';
// import Cable from './Cable';
// import UsersContainer from '../containers/UsersContainer'
// import VideoContainer from '../containers/VideoContainer'
// import { Grid, Image, Rail, Segment } from 'semantic-ui-react'
//
// class ConversationsList extends React.Component {
//   constructor(props){
//     super(props)
//     this.state = {
//     conversations: props.user.conversations,
//     user_id: this.props.user.id,
//     username: this.props.user.name,
//     activeConversation: null,
//     users:this.props.user.inactive,
//     pcPeers: {},
//     localstream: '',
//     conversationId: '',
//   }
// }
//
//
//
//
//   handleClick = id => {
//
//     this.setState({ activeConversation: id });
//   };
//
//   handleReceivedConversation = response => {
//     const { conversation } = response;
//     this.setState({
//       conversations: [...this.state.conversations, conversation]
//     });
//   };
//
//   handleReceivedMessage = response => {
//     const { message } = response;
//
//     const conversations = [...this.state.conversations];
//     const conversation = conversations.find(
//       conversation => conversation.id === message.conversation_id
//     );
//     conversation.messages = [...conversation.messages, message];
//     this.setState({ conversations });
//     };
//
//   handleReceivedVideo = response => {
//
//     const { video } = response;
//
//     const JOIN_ROOM = "JOIN_ROOM";
//     const EXCHANGE = "EXCHANGE";
//     const REMOVE_USER = "REMOVE_USER";
//       this.setState({conversationId: video.conversation_id})
//       if (video.from == this.state.user_id) return;
//       switch (video.kind) {
//         case JOIN_ROOM:
//           return this.joinRoom(video);
//         case EXCHANGE:
//           if (video.to !== this.state.user_id) return;
//           return this.exchange(video);
//         case REMOVE_USER:
//           return this.removeUser(video);
//         default:
//           return;
//         }
//   }
//
//
//   joinRoom = data => {
//
//     let localVideo = document.getElementById("local-video");
//
//     navigator.mediaDevices
//       .getUserMedia({ video: { width: 400, height: 300 }, audio: true })
//       .then(stream => {
//         localVideo.srcObject = stream;
//           localVideo.muted = true;
//           this.setLocalStream(stream)
//         }).then(()=> console.log("set local stream check", this.state))
//         .then(() => this.createPC(data.from, true))
//   };
//
//   createPC = (userId, isOffer) => {
//
//   const JOIN_ROOM = "JOIN_ROOM";
//   const EXCHANGE = "EXCHANGE";
//   const REMOVE_USER = "REMOVE_USER";
//   let friendVideo = document.getElementById('friend-video')
//   let pc = new RTCPeerConnection(ICE);
//   let connectObj = {}
//   connectObj[userId] = pc;
//   pc.addStream(this.state.localstream.stream);
//
//   isOffer &&
//     pc
//       .createOffer()
//       .then(offer => {
//         return pc.setLocalDescription(offer);
//       }).then(() => {
//         this.broadcastData({video:{
//           conversation_id: this.state.conversationId,
//           kind: EXCHANGE,
//           from: this.state.user_id,
//           user_id: this.state.user_id,
//           to: userId,
//           sdp: JSON.stringify(pc.localDescription)
//         }});
//       })
//
//   pc.onicecandidate = event => {
//     // debugger
//     event.candidate &&
//       this.broadcastData({video: {
//         conversation_id: this.state.conversationId,
//         kind: EXCHANGE,
//         from: this.state.user_id,
//         user_id: this.state.user_id,
//         to: userId,
//         candidate: JSON.stringify(event.candidate)
//       }});
//   };
//
//   pc.onaddstream = event => {
//
//     const element = document.createElement("video");
//     element.id = `remoteVideoContainer+${userId}`;
//     element.autoplay = "autoplay";
//     element.srcObject = event.stream;
//     friendVideo.appendChild(element);
//   };
//
//   pc.oniceconnectionstatechange = event => {
//     if (pc.iceConnectionState === "disconnected") {
//       console.log("Disconnected:", userId);
//       this.broadcastData({video:{
//         conversation_id: this.state.conversationId,
//         user_id: this.state.user_id,
//         type: REMOVE_USER,
//         from: userId
//       }});
//     }
//   };
//   console.log("pc obj outside of function", pc)
//   this.setState({
//     pcPeers: connectObj
//   }, () => console.log(this.state))
//   // debugger
//   return pc;
// };
//
//  exchange = data => {
//
//   let pc;
//   if (!this.state.pcPeers[data.from]) {
//     // debugger
//     pc = this.createPC(data.from, false);
//   } else {
//     pc =  this.state.pcPeers[data.from];
//   }
//
//   // debugger
//   if (data.candidate) {
//     let iceCand = new RTCIceCandidate(JSON.parse(data.candidate))
//     pc
//       .addIceCandidate(iceCand)
//       .then(resp => this.setState({pcPeers: { [data.from]: resp} }))
//         .then(console.log)
//   }
//   // debugger
//   if (data.sdp) {
//     let sdp = JSON.parse(data.sdp);
//     pc
//       .setRemoteDescription(new RTCSessionDescription(sdp))
//       .then(() => {
//         if (sdp.type === "offer") {
//           pc.createAnswer().then(answer => {
//             return pc.setLocalDescription(answer);
//           }).then(()=> {
//             this.broadcastData({video:{
//               conversation_id: this.state.conversationId,
//               kind: 'EXCHANGE',
//               user_id: this.state.user_id,
//               from: this.state.user_id,
//               to: data.from,
//               sdp: JSON.stringify(pc.localDescription)
//             }});
//           });
//         }
//       })
//   }
// };
//
//   handleUsersClick = (obj) => {
//     // console.log(this.state)
//     // debugger
//     let copy = [...this.state.users]
//     copy = copy.filter(user => user.id !== obj.id)
//     this.setState({
//       users: copy
//     })
//
//
//     fetch(API_ROOT+"/followers",{
//       method: "POST",
//       headers:{
//     'Content-Type': 'application/json'
//   },
//   body: JSON.stringify({currentU:this.props.user.name,otherU:obj.name})
//     })
//
//   }
//
//   setLocalStream = (stream) => {
//
//
//     this.setState({ localstream: {stream} })
//   }
//
//   broadcastData = data => {
//   fetch(API_ROOT + "videos", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: HEADERS
//   });
//   };
//
//
//   render = () => {
//     const { conversations, activeConversation, user_id, username } = this.state;
//     return (
//       <React.Fragment>
//         <Grid>
//         <Grid.Row columns={3} divided >
//           <Grid.Column width={4}>
//         <UsersContainer users={this.state.users} handleUsersClick={this.handleUsersClick} />
//         <ActionCable
//           channel={{ channel: 'ConversationsChannel' }}
//           onReceived={this.handleReceivedConversation}
//         />
//         {this.state.conversations.length ? (
//           <Cable
//             conversations={conversations}
//             handleReceivedMessage={this.handleReceivedMessage}
//             handleReceivedVideo={this.handleReceivedVideo}
//           />
//
//         ) : null}
//       </Grid.Column>
//
//       <Grid.Column width={8} >
//           {activeConversation ? (
//             <MessagesArea
//               conversation={findActiveConversation(
//                 conversations,
//                 activeConversation
//               )} user_id={user_id} username={username} setLocalStream={this.setLocalStream}
//             />
//           ) : <h1>Message Area</h1>}
//         </Grid.Column>
//
//
//
//       <Grid.Column width={4} >
//         <h2>Conversations</h2>
//         <ul>{mapConversations(conversations, this.handleClick, this.props.user.name)}</ul>
//         </Grid.Column>
//       </Grid.Row>
//
//     <Grid.Row columns={2}>
//       <Grid.Column >
//       <div id="videocontainer">
//         <video  id="local-video"  autoPlay> </video>
//       </div>
//     </Grid.Column>
//       <Grid.Column >
//         <div id="friend-video">
//         </div>
//
//       </Grid.Column>
//
//     </Grid.Row>
//   </Grid>
//   </React.Fragment>
//     );
//   };
// }
//
// export default ConversationsList;
//
//
// const findActiveConversation = (conversations, activeConversation, name) => {
//   return conversations.find(
//     conversation => conversation.id === activeConversation
//   );
// };
//
// const mapConversations = (conversations, handleClick, name) => {
//   return conversations.map(conversation => {
//     if (conversation.receiver.name === name){
//     return (
//       <li key={conversation.id} onClick={() => handleClick(conversation.id)}>
//         {conversation.author.name}
//       </li>
//     )} else {
//       return (
//         <li key={conversation.id} onClick={() => handleClick(conversation.id)}>
//           {conversation.receiver.name}
//         </li>
//
//     );
//   }
// })
// };
