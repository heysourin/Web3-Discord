require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config({ path: ".env" });
// require("@nomiclabs/hardhat-etherscan");

const RPC_HTTP_URL = process.env.RPC_HTTP_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;

module.exports = {
  solidity: "0.8.9",
  networks: {
    mumbai: {
      url: RPC_HTTP_URL,
      accounts: [PRIVATE_KEY],
      chainId: 80001,
    },
  },
  etherscan: {
    apiKey: ETHERSCAN_API_KEY,
  },
};