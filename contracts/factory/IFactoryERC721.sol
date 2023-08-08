//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @dev Interface of the factory for minting ERC721 assets.
 */
interface IFactoryERC721 {
    /**
     * @dev Mint ERC721 asset.
     *
     * Emits {MintedERC721} event.
     */
    function mint721(
        string memory name, 
        string memory symbol,
        bytes memory signature
    ) external;

    /**
     * @dev Emits when ERC721 asset is minted.
     */
    event MintedERC721(
        address indexed creator,
        string indexed name,
        string indexed symbol,
        address token
    );
}