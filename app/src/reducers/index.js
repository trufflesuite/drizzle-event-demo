import { toast } from 'react-toastify'
import { generateStore, EventActions } from 'drizzle'
import drizzleOptions from '../drizzleOptions'
import { put, takeEvery } from 'redux-saga/effects'

// Register a reducer to handle contract events from drizzle.
//
const eventsReducer = (state = {}, action) => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name
    const contractEvent = action.event.event
    const message = action.event.returnValues._message
    const display = `${contract}(${contractEvent}): ${message}`
    console.log('local App Reducer payload:', action)
    console.log('Contract event from redux', display)
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
const todoReducer = (state = {}, action) => {
  if (action.type === 'TODO') {
    console.log('TODO action', action)
    return action.joke
  }
  return state
}

// Connected dispatch function to attach to a button UI element
// Retrieve and dispatch a random chuck norris joke
//
export const fetchJoke = async dispatch => {
  console.log('Dispatching Chuck Norris joke ... They resolve when Chuck is good and ready.')
  const resp = await fetch('http://api.icndb.com/jokes/random')
  const json = await resp.json()
  const { joke } = json.value
  dispatch({ type: 'JOKE', joke })
}

// Generator function to retrieve a joke
// Retrieve a joke, and dispatch it to store
//
function * fetchTodo() {
  // Pretend this endpoint had some nice content.
  const joke = yield fetch('https://jsonplaceholder.typicode.com/todos/1')
    .then(response => response.json())
  yield put({ type: 'TODO', joke })
}

// Example App saga
//
function* appSaga() {
  yield takeEvery('LOOKUP_TODO', fetchTodo)
}

// Register app reducers to be incorporated into drizzle's redux store.
const appReducers = {
  events: eventsReducer,
  joke: jokeReducer,
  todo: todoReducer
}

// Declare your app has Sagas to be registered
const appSagas = [appSaga]


/* Generate the redux store by combining drizzleOptions, application reducers,
 * middleware and initial app state.
 *
 * @param {object} config - The configuration object
 * @param {object} config.drizzleOptions - drizzle configuration object
 * @param {object} [config.reducers={}] - application level reducers to include in store
 * @param {object[]} [config.appSagas=[]] - application saga middlewares to include in store
 * @param {boolean} [config.disableReduxDevTools=false] - disable redux devtools hook
 * @returns {object} Redux store
 */
const store = generateStore({
  drizzleOptions,
  appReducers,
  appSagas,
  disableReduxDevTools: false  // enable ReduxDevTools!
})
console.log('store', JSON.stringify(store.getState(), null, 2))

// Use the store with DrizzleProvider
export default store
