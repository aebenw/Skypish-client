import React, { Component } from 'react';
import ConversationsList from './components/ConversationsList';

class App extends Component {

  constructor(){
    super()
    this.state={
      userId: null,
    }
  }

  logIn = (userId) => {
    this.setState({
      userId
    })
  }


  render() {
    return (
      <div className="App">

        {this.state.loggedIn ? <ConversationsList user={this.state.userId}/> : <Login />}
      </div>
    );
  }
}

export default App;
