import React,{Fragment} from 'react';

import LogContainer from '../containers/LogInSignUp';
import WelcomeMessage from '../components/welcome/WelcomeMessage'



const Welcome = ({fetchUser, createUser}) => {

  return (
    <Fragment>

      <div className="ui two column grid welcome">
        <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom" style={{"width":"100%"}}>
          <h1 className="h2" style={{"color":"white", "paddingLeft": "1%"}}>Skypish</h1>
        </div>
        <div className='row'>
        <WelcomeMessage />
        <LogContainer fetchUser={fetchUser} createUser={createUser}/>
        </div>
      </div>
    </Fragment>
  )

}

export default Welcome
