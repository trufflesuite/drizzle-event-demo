import { toast } from 'react-toastify'
import { generateStore, EventActions } from 'drizzle'
import drizzleOptions from '../drizzleOptions'

// Register a reducer to handle contract events from drizzle.
//
const eventsReducer = (state = {}, action) => {
  if (action.type === EventActions.EVENT_FIRED) {
    const contract = action.name
    const contractEvent = action.event.event
    const message = action.event.returnValues._message
    const display = `${contract}(${contractEvent}): ${message}`

    // Side-effects in a reducer is an anti-pattern and is used here to
    // show the contract event is available.
    //
    console.log('local App Reducer payload:', action)
    console.log('Contract event from redux', display)
    toast.success(display, { position: toast.POSITION.TOP_RIGHT })
  }
  return state
}


// Register app reducers to be incorporated into drizzle's redux store.
const appReducers = {
  events: eventsReducer
}

/* Generate the redux store by combining drizzleOptions, application reducers,
 * middleware and initial app state.
 *
 * @param {object} config - The configuration object
 * @param {object} config.drizzleOptions - drizzle configuration object
 * @param {object} config.reducers={} - application level reducers to include in store
 * @param {object[]} config.appSagas=[] - application saga to include in store
 * @param {boolean} config.disableReduxDevTools=false - disable redux devtools hook
 * @returns {object} Redux store
 */
const store = generateStore({
  drizzleOptions,
  appReducers,
  disableReduxDevTools: false  // enable ReduxDevTools!
})

// Use the store with DrizzleProvider
export default store
