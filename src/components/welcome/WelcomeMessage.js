import React from 'react';


const WelcomeMessage = () => {

  return (
    <div className="eight wide column">
      <div className="welcome-message" style={{"paddingLeft": "10%", "paddingTop": "10%"}}>
        <h3 className="ui header">Welcome to Skypish!</h3>

        <p>This is a video chat and messaging application.</p>

        <p>To test the app you can login with the two users listed below in two tabs or on two separate computers. You can also make your own account, if you'd like.</p>

        <ul>
          <li>eben@eben.com</li>
          <li>juan@juan.com</li>
          <li>pass: test</li>
        </ul>

        <p>*The bulk of the app was built in a 4 day code sprint. The video function works on the first try 90% of the time. If it doesn't work at first, try  click the video button from the other user, the user who did not initiate the video chat. It also needs a little polishing and cosmetic work*</p>

        <p>Auth was implemented but its commented out in the App.js file. When testing on a single computer, it makes it little cumbersome to log into two profiles.</p>



        <p>Tech Specks</p>

        <ul>
          <li>React for Front End and Rails for backend</li>
          <li>PostgreSQL for DB</li>
          <li>Communicates messages and video information using WebRTC through ActionCable which uses Websockets and Redis.</li>
        </ul>
      </div>
    </div>
  )
}

export default WelcomeMessage
