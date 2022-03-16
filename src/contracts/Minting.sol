// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

// import "./ERC721Full.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract Minting is ERC721 {
  string[] public nfts;
  mapping(string => bool) _nftExists;

  abstract constructor() ERC721("Minting", "MINTNFT") public {
  }

  function mint(string memory _nft) public {
    require(!_nftExists[_nft]);
    uint _id = nfts.push(_nft);
    _mint(msg.sender, _id);
    _nftExists[_nft] = true;
  }

}