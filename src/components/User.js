import React from 'react'

const User = ({user, handleUsersClick}) => {
  return(
    <div class="media conversation">
      <div onClick={() => handleUsersClick(user)} class="media-body">
          <h5 class="media-heading">{user.name}</h5>
          {/* <small>Hello</small> */}
      </div>
    </div>
  )
}

export default User
