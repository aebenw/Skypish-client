import React, { Component } from 'react';
import Login from './components/Login'
import ConversationsList from './components/ConversationsList';

class App extends Component {

  constructor(){
    super()
    this.state={
      auth: {currentUser: {}}
    }
  }

  componentDidMount = () => {
    let token = localStorage.getItem("jwt")
    debugger

  }


  fetchUser = (event) => {
    event.preventDefault()

    let email = event.target.email.value;
    let password = event.target.password.value;

    let body = {
      email,
      password
    }
    fetch(`http://localhost:3000/auth`, {
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
      this.setState({
      currentUser: res
    })
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
