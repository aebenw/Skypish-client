import React, { Component } from 'react';
import Login from './components/Login'
import ConversationsList from './components/ConversationsList';

class App extends Component {

  constructor(){
    super()
    this.state={
      currentUser: null
    }
  }


  fetchUser = (event) => {
    event.preventDefault()

    let email = event.target.email.value;
    fetch(`http://localhost:3000/users/${email}`)
    .then(res => res.json())
    .then(currentUser => this.setState({
          currentUser
        }, () => console.log(this.state)))

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
