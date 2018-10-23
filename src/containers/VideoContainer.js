import React from 'react'
import Video from '../components/Video'

export default class VideoContainer extends React.Component {
  render(){
    return (
      <div>
        <Video handleJoinSession={this.props.handleJoinSession} handleLeaveSession={this.props.handleLeaveSession}/>
      </div>
    )
  }

}
