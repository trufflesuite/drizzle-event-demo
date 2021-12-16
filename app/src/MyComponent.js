import React from "react";
import { newContextComponents } from "@drizzle/react-components";
import logo from "./logo.png";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const { AccountData, ContractData, ContractForm } = newContextComponents;

export default ({ drizzle, drizzleState, accounts}) => {
  return (
    <div className="App">
      <ToastContainer />
      <div>
	<img src={logo} alt="drizzle-logo" />
	<h1>Drizzle Event Example</h1>
	<p>Connect and react to Solidity Contract events by hooking into Drizzle Redux state</p>
      </div>
      
      <div className="section">
	<h2>Active Account</h2>
	<AccountData
	  drizzle={drizzle}
	  drizzleState={drizzleState}
	  accountIndex={0}
	  units="ether"
	  precision={3}
	/>
      </div>

      <div className="section">
	<h2>SimpleStorage with event</h2>
	<p>Change the value to invoke a contract event</p>
	<p>
	  <strong>Stored Value: </strong>
	  <ContractData 
	    drizzle={drizzle}
	    drizzleState={drizzleState}
	    contract="SimpleStorage"
	    method="storedData"
	  />
	</p>
	<ContractForm drizzle={drizzle} contract="SimpleStorage" method="set" />
      </div>
    </div>
  );
};
