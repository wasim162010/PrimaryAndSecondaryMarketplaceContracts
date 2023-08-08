//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../primary/IAssetCommon.sol";

/**
 * @dev Interface for implementing best offer type of listing in marketplace
 */
interface IBestOfferSecondary is IAssetCommon {
    /**
     * @dev Emits when some token is listed.
     */
    event ListedOffer(
        address indexed account,
        uint256 offerItemId
    );

    /**
     * @dev Emits when some offer is accepted.
     */
    event AcceptedOffer(
        uint256 indexed offerItemId,
        uint256 indexed tokenId,
        address buyer,
        uint256 price
    );

    /**
     * @dev Emits when some offer is unlisted.
     */
    event UnlistedOffer(
        uint256 indexed offerItemId, 
        uint256 indexed tokenId
    );

    /**
     * @dev List item in Best offer marketplace
     */
    function listOfferItem(
        address asset,
        uint96 startPrice,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external;

    /**
     * @dev Accept some offer
     */
    function acceptOffer(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) external;

    /**
     * @dev Unlist some item by item ID.
     */
    function unlistOfferItem(uint256 itemId) external;
}