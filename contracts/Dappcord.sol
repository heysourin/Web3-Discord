// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Dappcord is ERC721, Ownable {
    uint256 public totalSupply;
    uint256 public totalChannels;
    address public contractOwner;

    struct Channel {
        uint256 id;
        string name;
        uint256 cost;
    }
    mapping(uint256 => Channel) public channels;
    mapping(uint256 => mapping(address => bool)) public hasJoined;

    constructor(
        string memory _name,
        string memory _symbol
    ) ERC721(_name, _symbol) {
        contractOwner = msg.sender;
    }

    function createChannel(
        string memory _name,
        uint256 _cost
    ) public onlyOwner {
        totalChannels++;
        channels[totalChannels] = Channel(totalChannels, _name, _cost);
    }

    function mint(uint256 _id) public payable {
        require(_id != 0);
        require(_id <= totalChannels);
        require(hasJoined[_id][msg.sender] == false, "Already minted");
        require(msg.value >= channels[_id].cost, "Insufficient ETH");

        hasJoined[_id][msg.sender] = true;
        totalSupply++;

        _safeMint(msg.sender, totalSupply);
    }

    function getChannel(uint256 _id) public view returns (Channel memory) {
        return channels[_id];
    }

    function withdraw() public onlyOwner {
        (bool success1, ) = contractOwner.call{value: address(this).balance}(
            ""
        );
        require(success1);
    }
}

//0x06Fd923bc2E4C981A53A539591068d17b5D02c4A
