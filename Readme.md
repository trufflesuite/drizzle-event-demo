Events with drizzle
===================

Lets create a front end app that can listen to contract events.
[Here's what the finished app looks like](https://youtu.be/jGIY_l8oWTQ)

Note: This is an investigation, and will likely lead to changes in Drizzle's API
to make this process more dev friendly.

Leverage an existing box
------------------------
```bash
$ truffle unbox drizzle

✔ Preparing to download
✔ Downloading
✔ Cleaning up temporary files
✔ Setting up box

Unbox successful. Sweet!

Commands:

  Compile:              truffle compile
  Migrate:              truffle migrate
  Test contracts:       truffle test
  Test dapp:            cd app && npm test
  Run dev server:       cd app && npm run start
  Build for production: cd app && npm run build
```

### Compile the contracts


```bash
$ event-demo truffle compile

Compiling ./contracts/ComplexStorage.sol...
Compiling ./contracts/Migrations.sol...
Compiling ./contracts/SimpleStorage.sol...
Compiling ./contracts/TutorialToken.sol...
Compiling openzeppelin-solidity/contracts/math/SafeMath.sol...
Compiling openzeppelin-solidity/contracts/token/ERC20/ERC20.sol...
Compiling openzeppelin-solidity/contracts/token/ERC20/IERC20.sol...
Writing artifacts to ./app/src/contracts
```

### Deploy the contracts to test chain

Fire up Ganache-cli (commandline) or Ganache (the UI) and then execute `truffle compile`

Tap into events
---------------

Reading through the [Drizzle
Guide for using an existing Redux Store](https://truffleframework.com/docs/drizzle/getting-started/using-an-existing-redux-store) loosely outlines the steps.
  * use redux's combineReducers to commbine app-state logic with drizzle's state
  * use redux's createStore to combine the updated reducer, imported saga middle
      ware and initial state

1. Add react-redux to project

```bash
$ app npm install redux react-redux
```

2. Hook up the Provider

```js

// Grab the store from our TBD, poorly named module
//
import composedStore from './reducers'

class App extends Component {
  render() {
    // pass the composed store to DrizzleProvider
    return (
      <DrizzleProvider store={composedStore} options={drizzleOptions}>
        <LoadingContainer>
          <MyContainer />
        </LoadingContainer>
      </DrizzleProvider>
    );
  }
}
```


2. Lets put these changes in ./reducers/index.js file
```js
import { combineReducers, createStore, applyMiddleware, compose } from 'redux'
import createSagaMiddleware from 'redux-saga'
import { all, fork } from 'redux-saga/effects'
import {
  drizzleReducers,
  drizzleSagas,
  generateContractsInitialState
} from 'drizzle'
import drizzleOptions from '../drizzleOptions'

// This event is fired when a contract event is detected.
const EVENT_FIRED = 'EVENT_FIRED'

// Consume the Event in this App level reducer
// Creating a connected component is left as an exercise to the reader
//
const events = (state = {}, action) => {
  if (action.type === EVENT_FIRED) {
    console.log('[Contract Event detected]: ', action)
  }
  return state
}

// Compose a redux State Tree with App (events), and drizzle reducer
//
const rootReducer = combineReducers({
  events,
  ...drizzleReducers
})

// Create an entrypoint Saga generator function to feed into the Saga middleware
//
function* rootSaga() {
  yield all(drizzleSagas.map(fork))
}

// Connect the Redux middleware to create the composit state
//
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

  sagaMiddleware.run(rootSaga)
  return store
}

export default makeLocalStore(drizzleOptions)
```

Connect a component
-------------------

Lets use [react-toaster]() to alert the user whenever a SimpleStorage contract event is emitted. We have to declare a <ToastContainer /> component and invoke `toast.success()` when an event is detected. We'll touch `MyComponent` and the event reducer respectively.

1. Add react-toastify to project.
```bash
$ npm install react-toastify
```

2. MyComponent: import ToastContainer and its css

```js
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

// edited out for clarity

  <div className="App">
    <ToastContainer />
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Drizzle Examples</h1>
      <p>Examples of how to get started with Drizzle in various situations.</p>
    </div>

```


3. Reducer: invoke toast.success when event is processed.
```js
const events = (state = {}, action) => {
  if (action.type === EVENT_FIRED) {
    console.log('local App Reducer: ', action)
    const contract = action.name
    const message = action.event.returnValues._message
    const display = `${contract}: ${message}`
    toast.success(display, { position: toast.POSITION.TOP_RIGHT })
  }
  return state
}
```
