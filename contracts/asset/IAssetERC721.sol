//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IAssetERC721 {
    function initialize(
        string memory name_, 
        string memory symbol_,
        address creator,
        address marketplace
    ) external;

    function mint(
        address creator,
        address to,
        uint96 feeNumerator,
        string memory uri
    ) external;
}