import React from 'react'

import ConversationsCont from '../containers/ConversationsCont'
import UserContainer from '../containers/UserContainer'


const SideBar = ({changeView}) => {

  return(
    <div class="row">
      <div class="col-lg-3">
        <div class="btn-panel btn-panel-conversation">
            <button class="btn  col-lg-6 send-message-btn" onClick={() => changeView(true)}>
              <i class="fa fa-search" ></i>
              Active Chats
            </button>
            <button class="btn  col-lg-6 send-message-btn" onClick={() => changeView(false)}>
              <i class="fa fa-plus"></i>
              Users
            </button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
