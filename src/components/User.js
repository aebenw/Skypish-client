import React from 'react'

export default class UsersContainer extends React.Component {

  handleClick =  () => {
    this.props.handleUsersClick(this.props.user)
}

  render(){
    const { name } = this.props.user
    return(
      <li class="nav-item">
        <p onClick={this.handleClick}>{name}</p>
      </li>
    )
  }
}
