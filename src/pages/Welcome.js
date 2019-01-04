import React,{Fragment} from 'react';

import LogContainer from '../containers/LogInSignUp';
import WelcomeMessage from '../components/auth/WelcomeMessage'



const Welcome = ({fetchUser}) => {

  return (
    <Fragment>
      <div className="ui two column grid welcome">
        <div className='row'>
        <WelcomeMessage />
        <LogContainer fetchUser={fetchUser}/>
        </div>
      </div>
    </Fragment>
  )

}

export default Welcome
