import React, {Component, Fragment} from 'react';

//components
import Login from '../components/welcome/Login'

class LogInSignUp extends Component {

  state = {
    login: true
  }

  changeView = (turnary) => {
    if(this.state.login !== turnary){
      this.setState({
        login: turnary
      })
    }
  }

  render() {
    const {login} = this.state
    const {fetchUser, createUser} = this.props
    return (<div className="column">
      <div className="ui middle aligned center aligned grid">
        <div id="login-box" className="column">
          <div className="row">
            <button onClick={() => this.changeView(false)}>SignUp</button>
            <button onClick={() => this.changeView(true)}>LogIn</button>
          </div>

          <div className="row">
            {login ?
            <Fragment>
              <h2 className="ui image header">
                <div className="content">
                  Log-in to your account
                </div>
              </h2>
              <Login fetchUser={fetchUser}/>
            </Fragment>
            :
            <Fragment>
            <h2 className="ui image header">
              <div className="content">
                Sign up for an account
              </div>
            </h2>
            <Login fetchUser={createUser}/>
            </Fragment>
            }
        </div>
        </div>
      </div>
    </div>)
  }
}

export default LogInSignUp
