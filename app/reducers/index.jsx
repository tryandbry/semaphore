import { combineReducers } from 'redux'

const rootReducer = combineReducers({
  auth: require('./auth').default,
  editor: require('./editor').default,
})

export default rootReducer
