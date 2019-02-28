const HDWalletProvider = require('truffle-hdwallet-provider');

//const fs = require('fs');
const mnemonic = "damage world video midnight shock off mushroom rate sample lady gap mention";


module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*", // Match any network id
      gas: 5000000
    },
    ropsten:  {
      provider: new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/5cfea0d474d94d178f030574a25eee02"),
      network_id: 3,
      gas: 4500000
    }
  },
  compilers: {
    solc: {
      settings: {
        optimizer: {
          enabled: true, // Default: false
          runs: 200      // Default: 200
        },
      }
    }
  }
};
