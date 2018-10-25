import React, { Fragment } from 'react'

export default class Video extends React.Component {
  // handleMedia = () => {
  //   const video = document.querySelector("video")
  //   this.video.srcObject =  this.props.stream
  // }


  render(){
    // const video = document.querySelector("video")
    // console.log(this.props.stream,video)
    return (
      <Fragment >
        <video  id="local-video"  autoPlay> </video>
      </Fragment>

    )
  }
}
