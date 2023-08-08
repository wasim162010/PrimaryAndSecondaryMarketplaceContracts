//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../primary/IAssetCommon.sol";

/**
 * @dev Interface for implementing fixed price type of listing in marketplace.
 */
interface IFixedPriceSecondary is IAssetCommon {
    /**
     * @dev Emits when item is listed for fixed price.
     */
    event ListedFixedPrice(
        address indexed account,
        uint256 fixedItemId
    );

    /**
     * @dev Emits when item is bought for fixed price.
     */
    event BoughtFixedPrice(
        uint256 indexed fixedItemId,
        uint256 indexed tokenId,
        address buyer
    );

    /**
     * @dev Emits when item is unlisted from fixed price listing.
     */
    event UnlistedFixedPrice(
        uint256 indexed fixedItemId,
        uint256 indexed tokenId
    );

    /**
     * @dev List item for fixed price in marketplace.
     */
    function listItemFixedPrice(
        address asset,
        uint96 price,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external;

    /**
     * @dev Buy item for fixed price in marketplace.
     */
    function buyItemFixedPrice(uint256 itemId) external;

    /**
     * @dev Unlist some item by item ID.
     */
    function unlistItemFixedPrice(uint256 itemId) external;
}
