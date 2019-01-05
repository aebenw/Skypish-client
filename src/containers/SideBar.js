import React from 'react'

const SideBar = ({changeView}) => {

  return(
    <div className="row">
      <div className="col-lg-3">
        <div className="btn-panel btn-panel-conversation">
            <button className="btn  col-lg-6 send-message-btn" onClick={() => changeView(true)}>
              <i className="fa fa-search" ></i>
              Active Chats
            </button>
            <button className="btn  col-lg-6 send-message-btn" onClick={() => changeView(false)}>
              <i className="fa fa-plus"></i>
              Users
            </button>
        </div>
      </div>
    </div>
  )
}

export default SideBar
