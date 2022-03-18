// SPDX-License-Identifier: MIT
pragma solidity ^0.5.0;

contract Tip {
  string public name;
  mapping(string => Image) public images;

  struct Image {
    string id;
    string hash;
    uint tipAmount;
    address payable author;
  }

  event ImageCreated(
    string id,
    string hash,
    uint tipAmount,
    address payable author
  );

  event ImageTipped(
    string id,
    string hash,
    uint tipAmount,
    address payable author
  );

  constructor() public {
    name = "Tip";
  }

  function uploadImage(string memory _imgHash, string memory _imgId) public {
    // Make sure the image hash exists
    require(bytes(_imgHash).length > 0);
    // Make sure uploader address exists
    require(msg.sender!=address(0));

    // Add Image to the contract
    images[_imgId] = Image(_imgId, _imgHash, 0, msg.sender);
    // Trigger an event
    emit ImageCreated(_imgId, _imgHash, 0, msg.sender);
  }

  function tipImageOwner(string memory _id) public payable {
    require(bytes(_id).length > 0);
    // Fetch the image
    Image memory _image = images[_id];
    // Fetch the author
    address payable _author = _image.author;
    // Pay the author by sending them Ether
    address(_author).transfer(msg.value);
    // Increment the tip amount
    _image.tipAmount = _image.tipAmount + msg.value;
    // Update the image
    images[_id] = _image;
    // Trigger an event
    emit ImageTipped(_id, _image.hash, _image.tipAmount, _author);
  }
}
