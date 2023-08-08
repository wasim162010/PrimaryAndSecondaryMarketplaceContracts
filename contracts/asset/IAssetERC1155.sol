//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IAssetERC1155 {
    function initialize(
        string memory uri_,
        address creator,
        address marketplace
    ) external;

    function mint(
        address creator,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data,
        uint96 feeNumerator
    ) external;
}