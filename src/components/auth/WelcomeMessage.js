import React from 'react';


const WelcomeMessage = () => {

  return (
    <div className="eight wide column">

      <h3 class="ui header"># Welcome to Skypish!</h3>
      <p>
      This is a video sharing and live messaging application. It allows two computers (on the same wifi network) to video chat with each other and send each other messages.

      *The APP is very buggy and needs more work, it was built in a 4 day code sprint. The video and messaging were the prime focus for the project, so pardon the presentation*

      To test the app you can log in in two tabs with two users, or on two separate computers -
        eben@eben.com
        juan@juan.com
        pass: test.

      Tech Specks
        -Uses React for Front End and Rails for backend
        -PostgreSQL for DB
        -Communicates messages and video information using ActionCable which uses Websockets and Redis.
        -Acompishes a peer to peer video connection with WebRTC.
      </p>
    </div>
  )
}

export default WelcomeMessage
