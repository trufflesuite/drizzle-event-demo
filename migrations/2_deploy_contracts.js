const SimpleStorage = artifacts.require("SimpleStorage");
const DimpleStorage = artifacts.require("DimpleStorage");
const TutorialToken = artifacts.require("TutorialToken");
const ComplexStorage = artifacts.require("ComplexStorage");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
  deployer.deploy(DimpleStorage);
  deployer.deploy(TutorialToken);
  deployer.deploy(ComplexStorage);
};
