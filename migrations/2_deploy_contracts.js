const MultiSender = artifacts.require("../contracts/MultiSender");

module.exports = function(deployer) {
  const name = "Santorini";
  const symbol = "Santo";
  const decimals = 18;
  deployer.deploy(MultiSender, name, symbol, decimals);
};
