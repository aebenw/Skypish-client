import React from 'react'

const VideoContainer = () => {
  return (
    <div id="videocontainer">
      <div>
        <video  id="local-video"  autoPlay> </video>
      </div>
      <div id="friend-video">
      </div>
    </div>
  )
}

export default VideoContainer
