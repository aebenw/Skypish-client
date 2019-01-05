import React from 'react'

const User = ({user, handleUsersClick}) => {
  return(
    <div className="media conversation">
      <div onClick={() => handleUsersClick(user)} className="media-body">
          <h5 className="media-heading">{user.name}</h5>
      </div>
    </div>
  )
}

export default User
