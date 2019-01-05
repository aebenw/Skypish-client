import React from 'react';


const WelcomeMessage = () => {

  return (
    <div className="eight wide column">
      <div className="welcome-message" style={{"paddingLeft": "10%", "paddingTop": "10%"}}>
        <h3 className="ui header">Welcome to Skypish!</h3>

        <p>This is a video sharing and live messaging application. It allows two users to video chat and send each other messages.</p>

        <p>*The app needs a little cosmetic work and some polishing. The bulk of it was built in a 3 day code sprint. The video funtion works first try 80% of the time. If it doesn't work on first try, try clicking the video button from the other user, the user who did not initiate the video chat. It also needs some polishing - user creation/validation, etc*</p>

        <p>Auth was implimented but its commented out in the App.js file. When testing on a single computer, it makes it little cumbersome to log into two profiles.</p>

        <p>To test the app you can login with the two users listed below two tabs with the two users listed below, or on two separate computers.</p>

        <ul>
          <li>eben@eben.com</li>
          <li>juan@juan.com</li>
          <li>pass: test</li>
        </ul>

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
