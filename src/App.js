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
<<<<<<< HEAD
    .then(currentUser => this.setState({
          currentUser
        }, () => console.log(this.state)))

=======
    .then(res => this.setState({
      userId: res
    }))
    //   method: "POST",
    //   headers: {
    //     "Content-type": "application/json"
    //   },
    //   body: JSON.stringify(body)
    // }).then(res => res.json())
    // .then(console.log)
    // this.setState({
    //   userId
    // })
>>>>>>> master
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
