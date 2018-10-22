import React, { Fragment } from 'react'

export default class UsersContainer extends React.Component {

  handleClick =  () => {
    this.props.handleUsersClick(this.props.user)
}

  render(){
    const { name } = this.props.user
    return(
      <Fragment>
        <p onClick={this.handleClick}>{name}</p>

      </Fragment>
    )
  }
}
