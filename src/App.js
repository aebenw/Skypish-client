import React, { Component } from 'react';
import Login from './components/Login'
import ConversationsList from './components/ConversationsList';

class App extends Component {

  constructor(){
    super()
    this.state={
      userId: null,
    }
  }


  fetchUser = (event) => {
    event.preventDefault()

    let email = event.target.email.value;
    fetch(`http://localhost:3001/users/${email}`)
    .then(res => res.json())
    .then(res => this.setState({
      userId: res
    }))
  }


  render() {
    return (
      <div className="App">
        {this.state.userId ? <ConversationsList user={this.state.userId}/> : <Login logIn={this.fetchUser}/>}
      </div>
    );
  }
}

export default App;
