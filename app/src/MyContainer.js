import MyComponent from './MyComponent'
import { drizzleConnect } from 'drizzle-react'

const mapStateToProps = state => ({
  accounts: state.accounts,
  SimpleStorage: state.contracts.SimpleStorage,
  TutorialToken: state.contracts.TutorialToken,
  drizzleStatus: state.drizzleStatus,
  web3: state.web3
})

const MyContainer = drizzleConnect(
  MyComponent,
  mapStateToProps
)

export default MyContainer
