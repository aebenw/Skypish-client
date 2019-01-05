import React, {Component, Fragment} from 'react';

//components
import Login from '../components/welcome/Login'
import SignUp from '../components/welcome/SignUp'



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
          {/* <div className="row"> */}
            <div className="btn-toolbar mb-2 mb-md-0" style={{"justifyContent":"center"}}>
              <button type="button" onClick={() =>this.changeView(true)} className="btn btn-md btn-outline-secondary" style={{"width":"30%"}}>
                Log In
              </button>
              <button type="button" onClick={() =>this.changeView(false)} className="btn btn-md btn-outline-secondary" style={{"width":"30%"}}>
                Sign Up
              </button>
            </div>
          {/* </div> */}
          { login ?
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
            <SignUp createUser={createUser}/>
          </Fragment>
          }
        </div>
      </div>
    </div>)
  }
}

export default LogInSignUp
