import React from 'react';

const Header = () => {
  return (
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
      <h1 className="h2">Skypish</h1>
      <div className="btn-toolbar mb-2 mb-md-0">
        <button type="button" onClick={() => logout()} className="btn btn-sm btn-outline-secondary">
          Log Out
        </button>
      </div>
    </div>
  )

}

const logout = () => {
    localStorage.removeItem("jwt")
    window.location.reload()
  }

export default Header
