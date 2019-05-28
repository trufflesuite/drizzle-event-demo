pragma solidity >=0.4.21 <0.6.0;

contract DimpleStorage {
    event DimpleSet(string _message);
    event DimpleNumber2(string _message);

    uint public storedData;

    function set(uint x) public {
        storedData = x;

        emit DimpleSet("Dimple Data stored successfully!");
        emit DimpleNumber2("Dimple #2");
    }
}
