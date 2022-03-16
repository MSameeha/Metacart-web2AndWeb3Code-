const Minting = artifacts.require("Minting");

module.exports = function(deployer) {
  deployer.deploy(Minting);

  module.exports = function(deployer) {
    // deploy the first
    deployer.deploy(Minting);
  };
};