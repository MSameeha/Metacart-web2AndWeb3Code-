// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

import "./ERC721Full.sol";

contract Minting is ERC721Full {
    string[] public nfts;
    mapping(string => bool) _nftExists;

    constructor() public ERC721Full("Minting", "MINTING") {}

    function mint(string memory _nft) public {
        require(!_nftExists[_nft]);
        uint256 _id = nfts.push(_nft);
        _mint(msg.sender, _id);
        _nftExists[_nft] = true;
    }
}
