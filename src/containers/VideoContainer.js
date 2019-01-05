import React from 'react'

const VideoContainer = () => {
  return (
    <div className="row" id="videocontainer" style={{"justifyContent":"center"}}>
      <div id="video-box">
      <video  id="local-video"  autoPlay> </video>
      </div>
      <div id="friend-video">
      </div>
    </div>
  )
}

export default VideoContainer
