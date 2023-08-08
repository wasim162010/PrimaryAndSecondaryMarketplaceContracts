//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "../primary/IAssetCommon.sol";

/**
 * @dev Interface for implementing auction type of listing in marketplace.
 */
interface IAuctionSecondary is IAssetCommon {
    /**
     * @dev Emits when some token is listed.
     */
    event ListedAuction (
        address indexed account,
        uint256 auctionItemId
    );

    /**
     * @dev Emits when auction is finished.
     */
    event FinishedAuction (
        uint256 indexed auctionItemId,
        uint256 indexed tokenId,
        uint256 indexed lastBid,
        address userFinished
    );

    /**
     * @dev Emits when auction is canceled.
     */
    event CanceledAuction (
        uint256 indexed auctionItemId,
        uint256 indexed tokenId
    );

    /**
     * @dev List item in auction.
     */
    function listAuction(
        address asset,
        uint96 startPrice,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external;

    /**
     * @dev Finishes auction for some item.
     */
    function finishAuction(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) external;

    /**
     * @dev Cancels auction for some item by item ID.
     */
    function cancelAuction(uint256 itemId) external;
}
