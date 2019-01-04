import React from 'react';


const WelcomeMessage = () => {

  return (
    <div className="eight wide column">
      <div className="welcome-message" style={{"padding-left": "10%", "padding-top": "10%"}}>
        <h3 class="ui header">Welcome to Skypish!</h3>
          <p>
          This is a video sharing and live messaging application. It allows two users to video chat and send each other messages.
        </p>
        <p>
          *The APP is a little buggy and needs some polishing. The bulk of it was built in a 3 day code sprint. The video button needs to sometimes be pressed twice for the connection to be made, it sometimes needs to be pressed on both ends, it sometimes just needs a second.*
          <p>
          To test the app you can log in in two tabs with two users, or on two separate computers -
          <p>
            <ul>
              <li>eben@eben.com</li>
            <li>juan@juan.com</li>
            <li>pass: test</li>
            </ul>
            </p>
          </p>
          <p>
          Tech Specks
          </p>
          <ul>
            <li>-React for Front End and Rails for backend</li>
            <li>-PostgreSQL for DB</li>
            <li>-Communicates messages and video information using ActionCable which uses Websockets and Redis.</li>
            <li>-Acompishes a peer to peer video connection with WebRTC.</li>
          </ul>
          </p>
        </div>
    </div>
  )
}

export default WelcomeMessage
