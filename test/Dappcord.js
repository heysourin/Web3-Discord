const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Dappcord smart contract testing", function () {
  let dappcord;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const Dappcord = await ethers.getContractFactory("Dappcord");
    dappcord = await Dappcord.deploy("Dappcord Token", "DP");
    await dappcord.deployed();
  });

  //----------------------//
  describe("State variables", function () {
    it("should set the correct contract owner", async function () {
      expect(await dappcord.contractOwner()).to.equal(owner.address);
    });

    it("should initialize totalSupply to zero", async function () {
      expect(await dappcord.totalSupply()).to.equal(0);
    });

    it("should initialize totalChannels to zero", async function () {
      expect(await dappcord.totalChannels()).to.equal(0);
    });
  });
  //----------------------//
  it("Should create a new channel on ouer discord web3", async function () {
    await dappcord.createChannel("Channel1", 100);
    const channel = await dappcord.getChannel(1);

    expect(channel.name).to.equal("Channel1");
    expect(channel.cost).to.equal("100");

    expect;
  });

  //----------------------//
  it("Should mint a token to msg.sender", async function () {
    await dappcord.createChannel("Channel1", 100);
    await dappcord.connect(addr1).mint(1, { value: 100 });

    const erc721TokenBalance = await dappcord.balanceOf(addr1.address);
    expect(erc721TokenBalance).to.equal(1);
  });

  //----------------------//
  it("Should not allow minting with invalid channelId", async function () {
    expect(dappcord.connect(addr1).mint(0, { value: 100 })).to.be.revertedWith(
      "revert"
    );
    expect(dappcord.connect(addr1).mint(1, { value: 100 })).to.be.revertedWith(
      "revert"
    );

    //Creating chennel before minting token is a must, which has not been done here. Two cases has shown
  });

  //----------------------//
  it("Should not allow minting of token with insufficient ETH", async function () {
    await dappcord.createChannel("Channel1", 100);

    await expect(
      dappcord.connect(addr1).mint(1, { value: 99 })
    ).to.be.revertedWith("Insufficient ETH");
  });

  //----------------------//

  it("Should not allow minting more than one tokne for a single user for a particular channel", async function () {
    await dappcord.createChannel("Channel 1", 100);
    const channel = await dappcord.getChannel(1);

    await dappcord.connect(addr1).mint(1, { value: channel.cost });
    await expect(
      dappcord.connect(addr1).mint(1, { value: channel.cost })
    ).to.be.revertedWith("Already minted");
  });
});
