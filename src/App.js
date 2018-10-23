import React, { Component } from 'react';
import Login from './components/Login'
import ConversationsList from './components/ConversationsList';
import { API_ROOT } from './constants';

class App extends Component {

  constructor(){
    super()
    this.state={
      auth: {currentUser: {}}
    }
  }



  fetchUser = (event) => {
    event.preventDefault()

    let email = event.target.email.value;
    let password = event.target.password.value;

    let body = {
      email,
      password
    }
    fetch(API_ROOT+`/auth`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(res => this.handleLogin(res))
  }

  handleLogin = (res) => {
    localStorage.setItem("jwt", res.jwt)
    //   this.setState({
    //   currentUser: res.current_user.user
    // })
  }


  render() {
    return (
      <div className="App">
        {this.state.currentUser ? <ConversationsList user={this.state.currentUser}/> : <Login fetchUser={this.fetchUser}/>}
      </div>
    );
  }
}

export default App;
