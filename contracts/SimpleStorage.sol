pragma solidity >=0.4.21 <0.6.0;

contract SimpleStorage {
    event StorageSet(string _message);

    uint public storedData;

    function set(uint x) public {
        storedData = x;
        emit StorageSet("Data stored successfully!");
    }

    function setAlwaysReverts(uint x) public payable {
        storedData = x;
        require(x == 42, "You must know the secret.");
        emit StorageSet("Data stored successfully!");
    }

    function payForUpdate(uint multiplier) public payable {
        storedData = multiplier * storedData;
        emit StorageSet("sigEndsWithArray: success!");
    }

}
