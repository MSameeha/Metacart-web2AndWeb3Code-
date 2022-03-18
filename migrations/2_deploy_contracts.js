const Tip = artifacts.require("Tip");
const Minting = artifacts.require("Minting");

module.exports = function(deployer) {
  deployer.deploy(Tip);
  deployer.deploy(Minting);
};