import React from "react";
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import {
  ContractData,
  ContractForm,
} from "drizzle-react-components";

import logo from "./logo.png";

export default ({ chuckNorrisLore, dadJokeLore }) => (
  <div className="App">
    <ToastContainer />
    <div>
      <img src={logo} alt="drizzle-logo" />
      <h1>Drizzle Event Example</h1>
      <p>Connect and react to Solidity Contract events by hooking into Drizzle Redux state</p>
    </div>

    <div className="section">
      <h2>Dispatch a web request</h2>
      <button onClick={() => chuckNorrisLore() }>Chuck Norris Lore!</button>
      <button onClick={() => dadJokeLore() }>DadJoke Lore!</button>
    </div>

    <div className="section">
      <h2>SimpleStorage with event</h2>
      <p>Change the value to invoke a contract event</p>
      <p>
        <strong>Stored Value: </strong>
        <ContractData contract="SimpleStorage" method="storedData" />
      </p>
      <ContractForm contract="SimpleStorage" method="set" />
    </div>
  </div>
);
