const { ethers, run, network } = require("hardhat");
//run allows to run any hardhat test

async function main() {
  const SimpleStorageFactory = await ethers.getContractFactory("Dappcord");
  console.log("Deploying contract...");
  const simpleStorage = await SimpleStorageFactory.deploy("Discord Token", "DT");
  await simpleStorage.deployed();

  console.log(`Contract deployed to ${simpleStorage.address}`);
  if (network.config.chainId === 80001 && process.env.ETHERSCAN_API_KEY) {
    await simpleStorage.deployTransaction.wait(1);
    await verify(simpleStorage.address, []);
  }
}

const verify = async (contractAddress, args) => {
  console.log("Verifying contract...")
  try {
    await run("verify:verify", {
      address: contractAddress,
      constructorArguments: args,
    })
  } catch (e) {
    if (e.message.toLowerCase().includes("already verified")) {
      console.log("Already Verified!")
    } else {
      console.log(e)
    }
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});