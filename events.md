Events with drizzle
===================

Lets create a front end app that can listen to contract events.

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

