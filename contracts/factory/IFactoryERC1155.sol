//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

/**
 * @dev Interface of the factory for minting ERC1155 assets.
 */
interface IFactoryERC1155 {
    /**
     * @dev Mint ERC1155 asset.
     *
     * Emits {MintedERC1155} event.
     */
    function mint1155(
        string memory uri,
        bytes memory signature
    ) external;

    /**
     * @dev Emits when ERC1155 asset is minted.
     */
    event MintedERC1155(
        string indexed uri,
        address indexed creator,
        address token
    );
}