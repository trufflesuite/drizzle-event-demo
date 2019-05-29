import Web3 from "web3";
import SimpleStorage from '../app/src/contracts/SimpleStorage'
import DimpleStorage from '../app/src/contracts/DimpleStorage'

const ul = document.querySelector('#events')

const LogEvent = msg => {
  const li = document.createElement('li')
  li.appendChild(document.createTextNode(msg))
  ul.appendChild(li)
}
const fallbackUrl = 'ws://127.0.0.1:9545'


const getWeb3FromEthereum = async () => {
  console.group("Is MetaMask injected?");
  const { ethereum } = window;
  if (!ethereum) {
    console.log('MetaMask Provider not detected')
    console.groupEnd()
    return
  }

  let web3 = new Web3(ethereum);
  await ethereum.enable();
  console.log('YES!')
  console.groupEnd()
  return web3

}

const getWeb3 = async() => {
  console.group('Resolve web3 provider')
  let web3 = await getWeb3FromEthereum()

  if (!web3) {
    const provider = new Web3.providers.WebsocketProvider(fallbackUrl)
    web3 = new Web3(provider)
  }
  console.groupEnd()
  return web3
}

const getAccounts = async web3 => {
  let accounts = await web3.eth.getAccounts()
  if (!accounts) {
    throw 'No accounts found!'
  }
  return accounts
}

const loadWeb3Contract = (web3, artifact, networkId, accounts) =>
  new web3.eth.Contract(
    artifact.abi,
    artifact.networks[networkId].address,
    {
      from: accounts[0],
      data: artifact.deployedBytecode
    }
  )

const registerWeb3ContractEvent = (contract, event) => {
  let counter = 0
  return contract.events[event]({}, (error, evt) => {
    if (!error) {
      const msg = `${event} fired ${++counter} times`
      LogEvent(msg)
      console.group(msg)
      console.log('event', evt)
      console.groupCollapsed('stack trace')
      console.trace()
      console.groupEnd()
      console.groupEnd()
    }
  })
}


const registerEvents = (web3, networkId, accounts) => {

  console.groupCollapsed('web3 connection details')
  console.log('web3', web3)
  console.log('networkId', networkId)
  console.log('accounts', accounts[0])
  console.groupEnd()

  const ssContract = loadWeb3Contract(web3, SimpleStorage, networkId, accounts)
  const dsContract = loadWeb3Contract(web3, DimpleStorage, networkId, accounts)

  console.group('Load contracts from web3')
  console.log('SimpleStorage retrieved by address')
  console.log('DimpleStorage retrieved by address')

  console.groupCollapsed('Contract details')
  console.log('SimpleStorage', ssContract)
  console.log('DimpleStorage', dsContract)
  console.groupEnd()

  console.groupEnd()

  registerWeb3ContractEvent(ssContract, 'StorageSet')
  registerWeb3ContractEvent(dsContract, 'DimpleNumber2')

  console.group('register contract events')
  console.log('listen for SimpleStorage::StorageSet events')
  console.log('listen for DimpleStorage::DimpleNumber2 events')
  console.groupEnd()

}

document.addEventListener("DOMContentLoaded", async () => {
  const web3 = await getWeb3();
  const accounts = await getAccounts(web3)

  registerEvents(web3, 5777, accounts)
});

const $app = document.querySelector('#app')
$app.innerText = 'Test web3 contract events'
