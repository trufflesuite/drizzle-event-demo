import React, { Component } from 'react'
import SimpleStorage from './contracts/SimpleStorage.json'
import DimpleStorage from './contracts/DimpleStorage.json'

export default class RegisterContractEvent extends Component {

  handleClick() {
    const { web3Instance: web3 } = this.props.web3
    const { networkId } = this.props.web3
    const { accounts } = this.props
    console.log('web3', web3)
    console.log('networkId', networkId)
    console.log('accounts', accounts[0])

    const SimpleStorageAddress = '0x082bF3C35773fE84b1e19aA49d1eC59dd742a6C8'

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

    console.log('ssContract', ssContract)
    console.log('dsContract', dsContract)


    // register for simple storage
    ssContract.events.StorageSet({}, (error, event) => {
      if (!error) {
        console.groupCollapsed('StorageSet Independent Event')
        console.log('event', event)
        console.groupEnd()
      }
    })

    dsContract.events.DimpleNumber2({}, (error, event) => {
      if (!error) {
        console.groupCollapsed('DimpleSet Independent Event')
        console.log('event', event)
        console.groupEnd()
      }
    })
  }

  render() {

    return (
      <button onClick={() => this.handleClick() }>Click to register independent Contract Events</button>
    )

  }
}
