
import React from 'react';
import User from '../components/User'


const mapUsers = (users, handleUsersClick) => {
  return (users.map(user => <User key={user.id} user={user}  handleUsersClick={handleUsersClick}/>))
}


const UserContainer = ({users, handleUsersClick}) => {
  return (
        <div className="conversation-wrap col-lg-3">
            {mapUsers(users, handleUsersClick)}
        </div>


  )
}

export default UserContainer
