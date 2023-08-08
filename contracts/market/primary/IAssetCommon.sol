//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

interface IAssetCommon {
    enum AssetType {
        undefined,
        ERC721,
        ERC1155
    }
}