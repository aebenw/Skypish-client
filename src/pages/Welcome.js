import React,{Fragment} from 'react';

import LogContainer from '../containers/LogInSignUp';
import WelcomeMessage from '../components/auth/WelcomeMessage'



const Welcome = ({fetchUser}) => {

  return (
    <Fragment>

      <div className="ui two column grid welcome">
              <div class="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom" style={{"width":"100%"}}>
                <h1 class="h2" style={{"color":"white"}}>Skypish</h1>
              </div>
        <div className='row'>
        <WelcomeMessage />
        <LogContainer fetchUser={fetchUser}/>
        </div>
      </div>
    </Fragment>
  )

}

export default Welcome
