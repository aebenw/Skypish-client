
import React from 'react';
import User from '../components/User'


const mapUsers = (users, handleUsersClick) => {
  // debugger
  return (users.map(user => <User key={user.id} user={user}  handleUsersClick={handleUsersClick}/>))
}


const UserContainer = ({users, handleUsersClick}) => {
  // debugger
  return (
        <div class="conversation-wrap col-lg-3">
            {mapUsers(users, handleUsersClick)}
        </div>


  )
}

export default UserContainer
