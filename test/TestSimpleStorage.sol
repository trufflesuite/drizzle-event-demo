//SPDX-License-Identifier: MIT
pragma solidity >=0.8.10;

import "truffle/Assert.sol";
import "truffle/DeployedAddresses.sol";
import "../contracts/SimpleStorage.sol";

contract TestSimpleStorage {
    function testItStoresAValue() public {
        SimpleStorage simpleStorage = SimpleStorage(DeployedAddresses.SimpleStorage());

        simpleStorage.set(89);

        uint expected = 89;

        Assert.equal(simpleStorage.storedData(), expected, "It should store the value 89.");
    }
}
