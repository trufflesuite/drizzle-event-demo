import SimpleStorage from "./contracts/SimpleStorage.json";
import DimpleStorage from "./contracts/DimpleStorage.json";
import ComplexStorage from "./contracts/ComplexStorage.json";
import TutorialToken from "./contracts/TutorialToken.json";

const options = {
  web3: {
    block: false,
    fallback: {
      type: "ws",
      url: "ws://127.0.0.1:9545",
    },
  },
  contracts: [SimpleStorage, DimpleStorage, ComplexStorage, TutorialToken],
  events: {
    // SimpleStorage: ["StorageSet"],
    // DimpleStorage: ["DimpleSet", "DimpleNumber2"],
    DimpleStorage: ["DimpleSet"],
    // ComplexStorage: ["ComplexCreated"]
  },
  polls: {
    // set polling interval to 30secs so we don't get buried in poll events
    accounts: 30000,
  },
};

export default options;
