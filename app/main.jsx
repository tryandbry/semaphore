'use strict'
import React from 'react'
import {Router, Route, IndexRedirect, browserHistory} from 'react-router'
import {render} from 'react-dom'
import {connect, Provider} from 'react-redux'

import store from './store'
import Jokes from './components/Jokes'
import Login from './components/Login'
import WhoAmI from './components/WhoAmI'
import NotFound from './components/NotFound'
import Semaphore from './components/Semaphore'
import Draft from './components/Draft'
import DraftWithSockets from './components/DraftWithSockets'
import DraftContainer from './containers/DraftContainer'
import TweetEditorExample from './examples/tweet'
import EntityEditorExample from './examples/entity'
import testEntity from './components/testEntity'

const ExampleApp = connect(
  ({ auth }) => ({ user: auth })
)(
  ({ user, children }) =>
    <div>
      <nav>
        {user ? <WhoAmI/> : <Login/>}
      </nav>
      {children}
    </div>
)

render(
  <Provider store={store}>
    <Router history={browserHistory}>
      <Route path="/" component={ExampleApp}>
        <IndexRedirect to="/jokes" />
        <Route path="/jokes" component={Jokes} />
      </Route>
      <Route path="/semaphore" component={Semaphore} />
      <Route path="/draft" component={Draft} />
      <Route path="/draftwithsockets" component={DraftWithSockets} />
      <Route path="/draftredux/:roomId" component={DraftContainer} />
      <Route path="/example/tweet" component={TweetEditorExample} />
      <Route path="/example/entity" component={EntityEditorExample} />
      <Route path="/test/entity" component={testEntity} />
      <Route path='*' component={NotFound} />
    </Router>
  </Provider>,
  document.getElementById('main')
)
