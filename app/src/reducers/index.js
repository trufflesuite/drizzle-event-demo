import { toast } from 'react-toastify'
import { generateStore, EventActions } from 'drizzle'
import drizzleOptions from '../drizzleOptions'

const events = (state = {}, action) => {
  if (action.type === EventActions.EVENT_FIRED) {
    console.log('local App Reducer: ', action)
    const contract = action.name
    const message = action.event.returnValues._message
    const display = `${contract}: ${message}`
    toast.success(display, { position: toast.POSITION.TOP_RIGHT })
  }
  return state
}

const joke = (state = {}, action) => {
  if (action.type === 'JOKE') {
    toast.success(action.joke, {position: toast.POSITION.TOP_LEFT})
    return action.joke
  }
  return state
}

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

export const fetchJoke = async dispatch => {
  const resp = await fetch('http://api.icndb.com/jokes/random')
  const json = await resp.json()
  const {joke} = json.value
  console.log('joke payload', joke)
  dispatch({type: 'JOKE', joke})
}

// Register app reducers to be incorporated into drizzle's redux store.
const appReducers = { events, joke }

// Don't forget to set your state
const initialAppState = { events: {}, joke: {} }

// declare your app has Sagas to be registered
const appSagas = []

// declare app middleware to be included
const appMiddlewares = []

export default generateStore({
  drizzleOptions,
  appReducers,
  appSagas,
  initialAppState,
  appMiddlewares,
  disableReduxDevTools: false
})
