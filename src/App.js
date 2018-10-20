import React, { Component } from 'react';
import ConversationsList from './components/ConversationsList';

class App extends Component {

  constructor(){
    super()
    this.state={
      userId: null,
    }
  }

  fetchUser = (userId) => {
    fetch('https://localhost3000/users')

    this.setState({
      userId
    })
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
