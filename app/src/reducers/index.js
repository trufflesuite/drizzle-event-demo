import { toast } from 'react-toastify'
import { generateStore, EventActions } from 'drizzle'
import drizzleOptions from '../drizzleOptions'
import { put, takeEvery } from 'redux-saga/effects'

// Register a reducer to handle contract events from drizzle.
//
const eventsReducer = (state = {}, action) => {
  if (action.type === EventActions.EVENT_FIRED) {
    console.log('local App Reducer: ', action)
    const contract = action.name
    const message = action.event.returnValues._message
    const display = `${contract}: ${message}`
    toast.success(display, { position: toast.POSITION.TOP_RIGHT })
  }
  return state
}

// Example App reducer
// Update joke state and publish joke alert toast
//
const jokeReducer = (state = {}, action) => {
  if (action.type === 'JOKE') {
    console.log('joke action', action)
    toast.success(action.joke, { position: toast.POSITION.TOP_LEFT })
    return action.joke
  }
  return state
}

// Another App reducer example
// Update the state and console log the information
//
const dadJokeReducer = (state = {}, action) => {
  if (action.type === 'DADJOKE') {
    console.log('DAD action', action)
    return action.joke
  }
  return state
}

// Connected dispatch function to attach to a button UI element
// Retrieve and dispatch a random chuck norris joke
//
export const fetchJoke = async dispatch => {
  const resp = await fetch('http://api.icndb.com/jokes/random')
  const json = await resp.json()
  const { joke } = json.value
  dispatch({ type: 'JOKE', joke })
}

// Generator function to retrieve a joke
// Retrieve a joke, and dispatch it to store
//
function * fetchDadJoke() {
  const joke = yield fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
    .then(json => json)
  yield put({ type: 'DADJOKE', joke })
}

// Example App saga
//
function* appSaga() {
  yield takeEvery('LOOKUP_JOKE', fetchDadJoke)
}

// Register app reducers to be incorporated into drizzle's redux store.
const appReducers = {
  events: eventsReducer,
  joke: jokeReducer,
  dadJoke: dadJokeReducer
}

// Set initial app state
const initialAppState = { events: {}, joke: {}, dadJoke: {} }

// Declare your app has Sagas to be registered
const appSagas = [appSaga]

// Declare app middleware to be included
// Todo: Try adding redux-thunk (a simple middleware)
//       and any a few others
const appMiddlewares = []

/* Generate the redux store by combining drizzleOptions, application reducers,
 * middleware and initial app state.
 *
 * @param {object} config - The configuration object
 * @param {object} config.drizzleOptions - drizzle configuration object
 * @param {object} [config.reducers={}] - application level reducers to include in store
 * @param {object[]} [config.appSagas=[]] - application saga middlewares to include in store
 * @param {object[]} [config.appMiddlewares=[]] - application middlewares to include in store
 * @param {object} [config.initialAppState={}] - application store tree initial value
 * @param {boolean} [config.disableReduxDevTools=false] - disable redux devtools hook
 * @returns {object} Redux store
 */
export default generateStore({
  drizzleOptions,
  appReducers,
  appSagas,
  initialAppState,
  appMiddlewares,
  disableReduxDevTools: false  // enable ReduxDevTools!
})
