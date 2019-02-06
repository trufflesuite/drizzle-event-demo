import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import {
  drizzleReducers,
  drizzleSagas,
  generateContractsInitialState
} from 'drizzle'
import drizzleOptions from '../drizzleOptions'

// this should be importable from drizzle
// or exposed from drizzle-react
//
const EVENT_FIRED = 'EVENT_FIRED'

const events = (state = {}, action) => {
  if (action.type === EVENT_FIRED) {
    console.log('local App Reducer: ', action)
  }
  return state
}

const rootReducer = combineReducers({
  events,
  ...drizzleReducers
})

function* rootSaga() {
  yield all(drizzleSagas.map(fork))
}

const makeLocalStore = options => {
  // Redux DevTools
  const composeEnhancers =
    global.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  // Preloaded state
  var preloadedState = {
    contracts: generateContractsInitialState(options)
  }

  // create the saga middleware
  const sagaMiddleware = createSagaMiddleware()

  const store = createStore(
    rootReducer,
    preloadedState,
    composeEnhancers(applyMiddleware(sagaMiddleware))
  )

  console.log('drizzleSagas', rootSaga)

  sagaMiddleware.run(rootSaga)
  return store
}

export default makeLocalStore(drizzleOptions)
