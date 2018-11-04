import React, { Component,Fragment } from 'react'
import Users from '../components/Users'

export default class UsersContainer extends Component {


  render(){
    const users =  this.props.users.map(user => <Users key={user.id} user={user}  handleUsersClick={this.props.handleUsersClick}/>)
    return(
      <Fragment>
        <h2>All Users</h2>
        {users}
      </Fragment>
    )
  }
}
