import React, { Component } from 'react'
import SimpleStorage from './contracts/SimpleStorage.json'
import DimpleStorage from './contracts/DimpleStorage.json'

export default class RegisterContractEvent extends Component {

  handleClick() {
    const { web3Instance: web3 } = this.props.web3
    const { networkId } = this.props.web3
    const { accounts } = this.props

    console.groupCollapsed('handleClick props')
    console.log('web3', web3)
    console.log('networkId', networkId)
    console.log('accounts', accounts[0])
    console.groupEnd()

    const ssContract = new web3.eth.Contract(
      SimpleStorage.abi,
      SimpleStorage.networks[networkId].address,
      {
        from: accounts[0],
        data: SimpleStorage.deployedBytecode
      }
    )

    const dsContract = new web3.eth.Contract(
      DimpleStorage.abi,
      DimpleStorage.networks[networkId].address,
      {
        from: accounts[0],
        data: DimpleStorage.deployedBytecode
      }
    )

    console.groupCollapsed('Loaded contracts from web3')
    console.log('ssContract', ssContract)
    console.log('dsContract', dsContract)
    console.groupEnd()


    // register for simple storage
    ssContract.events.StorageSet({}, (error, event) => {
      if (!error) {
        console.group('Independent Event: StorageSet')
        console.log('event', event)
        console.groupEnd()
      }
    })

    dsContract.events.DimpleNumber2({}, (error, event) => {
      if (!error) {
        console.group('Independent Event: DimpleSet')
        console.log('event', event)
        console.groupEnd()
      }
    })

    console.log('Independend events registered...')
  }

  render() {

    return (
      <button onClick={() => this.handleClick() }>Click to register independent Contract Events</button>
    )

  }
}
