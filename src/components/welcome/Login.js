import React from 'react'

const Login = ({ fetchUser }) => {

  return (

        <form onSubmit={(event) => fetchUser(event)} className="ui large form" style={{"background":"#212528"}}>
          <div className="ui stacked secondary  segment" style={{"background":"#FFFFFF"}}>
            <div className="field">
              <div className="ui left icon input">
                <i className="user icon"></i>
                <input type="text" name="email" placeholder="E-mail address" />
              </div>
            </div>
            <div className="field">
              <div className="ui left icon input">
                <i className="lock icon"></i>
                <input type="password" name="password" placeholder="Password" />
              </div>
            </div>
            <input type="submit" className="ui fluid large blue submit button" value="Login" />
          </div>

        </form>


  )
}

export default Login;
