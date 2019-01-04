import React, {Component} from 'react';

//components
import Login from '../components/welcome/Login'

class LogInSignUp extends Component {

  state = {
    login: true
  }

  render() {
    return (<div className="column">
      <div className="ui middle aligned center aligned grid">
        <div id="login-box" className="column">
          <h2 className="ui image header">
            <div className="content">
              Log-in to your account
            </div>
          </h2>
          <Login fetchUser={this.props.fetchUser}/>
        </div>
      </div>
    </div>)
  }
}

export default LogInSignUp
