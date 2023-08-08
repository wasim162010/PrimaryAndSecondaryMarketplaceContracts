//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";

import "./../asset/IAssetERC721.sol";
import "./../asset/IAssetERC1155.sol";

import "./secondary/IAuctionSecondary.sol";
import "./secondary/IBestOfferSecondary.sol";
import "./secondary/IFixedPriceSecondary.sol";

contract SecondaryMarketplace is
    IAuctionSecondary,
    IBestOfferSecondary,
    IFixedPriceSecondary,
    Initializable,
    IERC721ReceiverUpgradeable,
    IERC1155ReceiverUpgradeable,
    OwnableUpgradeable
{
    using ECDSA for bytes32;

    error InvalidItemStatus();
    error OnlyOwnerRequired();
    error InvalidSignature();

    enum Status {
        undefined,
        CREATE,
        SOLD,
        CANCEL
    }

    struct AuctionItem {
        uint256 asset_price;
        uint256 tokenId_amount;
        uint256 seller_type_status;
    }

    struct OfferItem {
        address asset;
        uint256 seller_type_status;
        uint256 tokenId_amount;
    }

    struct FixedPriceItem {
        uint256 asset_price;
        uint256 tokenId_amount;
        uint256 seller_type_status;
    }

    /**
     * @dev Address of WETH
     */
    IERC20 private constant _WETH =
        IERC20(0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2);

    /**
     * @dev ID that represents amount of auction items.
     */
    uint64 private _auctionItemId;

    /**
     * @dev ID that represents amount of offer items.
     */
    uint64 private _offerItemId;

    /**
     * @dev ID that represents amount of items.
     */
    uint64 private _fixedItemId;

    /**
     * @dev Validator for signing transactions.
     */
    address private _validator;

    /**
     * @dev Comission to the marketplace.
     */
    uint8 private _comission;

    /**
     * @dev Comission volume.
     */
    uint256 private _totalComissions;

    /**
     * @dev Mappig from auction item ID to auction item.
     */
    mapping(uint256 => AuctionItem) private auctionItems;

    /**
     * @dev Mappig from offer item ID to offer item.
     */
    mapping(uint256 => OfferItem) private offerItems;

    /**
     * @dev Mappig from fixed price item ID to fixed price item.
     */
    mapping(uint256 => FixedPriceItem) private fixedPriceItems;

    /**
     * @dev Constructor for upgradable contract.
     */
    function initialize(address validator_, uint8 comission_)
        external
        initializer
    {
        _validator = validator_;
        _comission = comission_;

        __Ownable_init();
    }

    /**
     * @dev
     */
    function totalComissions() external view returns (uint256) {
        return _totalComissions;
    }

    /**
     * @dev
     */
    function comission() external view returns (uint8) {
        return _comission;
    }

    /**
     * @dev
     */
    function validator() external view returns (address) {
        return _validator;
    }

    /**
     * @dev
     */
    function fixedItemId() external view returns (uint256) {
        return _fixedItemId;
    }

    /**
     * @dev
     */
    function offerItemId() external view returns (uint256) {
        return _offerItemId;
    }

    /**
     * @dev
     */
    function auctionItemId() external view returns (uint256) {
        return _auctionItemId;
    }

    /**
     * @dev Getter for auction item.
     */
    function getAuctionItem(uint256 itemId)
        external
        view
        returns (
            address asset,
            uint96 startPrice,
            uint128 tokenId,
            uint128 amount,
            address seller,
            AssetType assetType,
            Status status
        )
    {
        AuctionItem storage item = auctionItems[itemId];
        (asset, startPrice) = _decodeAssetPrice(item.asset_price);
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (seller, assetType, status) = _decodeSellerTypeStatus(
            item.seller_type_status
        );
    }

    /**
     * @dev Getter for best offer item
     */
    function getOfferItem(uint256 itemId)
        external
        view
        returns (
            address asset,
            uint128 tokenId,
            uint128 amount,
            address seller,
            AssetType assetType,
            Status status
        )
    {
        OfferItem storage item = offerItems[itemId];
        (seller, assetType, status) = _decodeSellerTypeStatus(
            item.seller_type_status
        );
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        asset = item.asset;
    }

    /**
     * @dev Getter for auction item.
     */
    function getFixedPriceItem(uint256 itemId)
        external
        view
        returns (
            address asset,
            uint96 startPrice,
            uint128 tokenId,
            uint128 amount,
            address seller,
            AssetType assetType,
            Status status
        )
    {
        FixedPriceItem storage item = fixedPriceItems[itemId];
        (asset, startPrice) = _decodeAssetPrice(item.asset_price);
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (seller, assetType, status) = _decodeSellerTypeStatus(
            item.seller_type_status
        );
    }

    /**
     * @dev See {IAuction-listAuction721}.
     */
    function listAuction(
        address asset,
        uint96 startPrice,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external override {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                startPrice,
                amount,
                assetType,
                msg.sender
            )
        );
        _validateSignature(data, signature);
        _safeTransfer(
            tokenId,
            asset,
            msg.sender,
            address(this),
            amount,
            assetType
        );

        AuctionItem storage item = auctionItems[_auctionItemId];
        item.asset_price = _encodeAssetPrice(asset, startPrice);
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_type_status = _encodeSellerTypeStatus(
            msg.sender,
            assetType
        );

        emit ListedAuction(msg.sender, _auctionItemId);

        _auctionItemId++;
    }

    /**
     * @dev See {IBestOffer-listItem}.
     */
    function listOfferItem(
        address asset,
        uint96 startPrice,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external override {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                startPrice,
                amount,
                assetType,
                msg.sender
            )
        );
        _validateSignature(data, signature);
        _safeTransfer(
            tokenId,
            asset,
            msg.sender,
            address(this),
            amount,
            assetType
        );

        OfferItem storage item = offerItems[_offerItemId];
        item.asset = asset;
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_type_status = _encodeSellerTypeStatus(
            msg.sender,
            assetType
        );

        emit ListedOffer(msg.sender, _offerItemId);

        _offerItemId++;
    }

    /**
     * @dev See {IFixedPrice-listItemFixedPrice}.
     * NOTE: Approve required.
     */
    function listItemFixedPrice(
        address asset,
        uint96 price,
        uint128 tokenId,
        uint128 amount,
        AssetType assetType,
        bytes memory signature
    ) external override {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                price,
                amount,
                assetType,
                msg.sender
            )
        );
        _validateSignature(data, signature);

        FixedPriceItem storage item = fixedPriceItems[_fixedItemId];
        item.asset_price = _encodeAssetPrice(asset, price);
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_type_status = _encodeSellerTypeStatus(
            msg.sender,
            assetType
        );

        _fixedItemId++;

        emit ListedFixedPrice(msg.sender, _fixedItemId);
    }

    /**
     * @dev See {IAuction-finishAuction}.
     */
    function finishAuction(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) external override {
        bytes32 _data = keccak256(abi.encodePacked(itemId, bid, buyer));
        _validateSignature(_data, signature);

        AuctionItem storage item = auctionItems[itemId];
        (address asset, ) = _decodeAssetPrice(item.asset_price);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(
            item.tokenId_amount
        );
        (
            address seller,
            AssetType assetType,
            Status status
        ) = _decodeSellerTypeStatus(item.seller_type_status);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        _safePayment(bid, buyer, seller, asset, tokenId);
        _safeTransfer(tokenId, asset, address(this), buyer, amount, assetType);

        item.seller_type_status = _setStatus(
            Status.SOLD,
            item.seller_type_status
        );

        emit FinishedAuction(itemId, tokenId, bid, seller);
    }

    /**
     * @dev See {IBestOffer-acceptOffer}.
     */
    function acceptOffer(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) external override {
        bytes32 _data = keccak256(abi.encodePacked(itemId, bid, buyer));
        _validateSignature(_data, signature);

        OfferItem storage item = offerItems[itemId];
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(
            item.tokenId_amount
        );
        (
            address seller,
            AssetType assetType,
            Status status
        ) = _decodeSellerTypeStatus(item.seller_type_status);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);
        _safePayment(bid, buyer, seller, item.asset, tokenId);
        _safeTransfer(
            tokenId,
            item.asset,
            address(this),
            buyer,
            amount,
            assetType
        );

        item.seller_type_status = _setStatus(
            Status.SOLD,
            item.seller_type_status
        );

        emit AcceptedOffer(itemId, tokenId, buyer, bid);
    }

    /**
     * @dev See {IFixedPrice-buyItemFixedPrice}.
     */
    function buyItemFixedPrice(uint256 itemId) external override {
        FixedPriceItem storage item = fixedPriceItems[itemId];
        (address asset, uint256 price) = _decodeAssetPrice(item.asset_price);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(
            item.tokenId_amount
        );
        (
            address seller,
            AssetType assetType,
            Status status
        ) = _decodeSellerTypeStatus(item.seller_type_status);

        _onlyCreatedItem(status);
        _safePayment(price, msg.sender, seller, asset, tokenId);
        _safeTransfer(tokenId, asset, seller, msg.sender, amount, assetType);

        item.seller_type_status = _setStatus(
            Status.SOLD,
            item.seller_type_status
        );

        emit BoughtFixedPrice(itemId, tokenId, msg.sender);
    }

    /**
     * @dev See {IAuction-cancelAuction}.
     */
    function cancelAuction(uint256 itemId) external override {
        AuctionItem storage item = auctionItems[itemId];
        (
            address seller,
            AssetType assetType,
            Status status
        ) = _decodeSellerTypeStatus(item.seller_type_status);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(
            item.tokenId_amount
        );
        (address asset, ) = _decodeAssetPrice(item.asset_price);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);
        _safeTransfer(tokenId, asset, address(this), seller, amount, assetType);

        item.seller_type_status = _setStatus(
            Status.CANCEL,
            item.seller_type_status
        );

        emit CanceledAuction(itemId, tokenId);
    }

    /**
     * @dev See {IBestOffer-unlistItem}
     */
    function unlistOfferItem(uint256 itemId) external override {
        OfferItem storage item = offerItems[itemId];

        (
            address seller,
            AssetType assetType,
            Status status
        ) = _decodeSellerTypeStatus(item.seller_type_status);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(
            item.tokenId_amount
        );

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);
        _safeTransfer(
            tokenId,
            item.asset,
            address(this),
            seller,
            amount,
            assetType
        );

        item.seller_type_status = _setStatus(
            Status.CANCEL,
            item.seller_type_status
        );

        emit UnlistedOffer(itemId, tokenId);
    }

    /**
     * @dev See {IFixedPrice-}
     */
    function unlistItemFixedPrice(uint256 itemId) external override {
        FixedPriceItem storage item = fixedPriceItems[itemId];

        (address seller, , Status status) = _decodeSellerTypeStatus(
            item.seller_type_status
        );
        (uint128 tokenId, ) = _decodeTokenIdAmount(item.tokenId_amount);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        item.seller_type_status = _setStatus(
            Status.CANCEL,
            item.seller_type_status
        );

        emit UnlistedFixedPrice(itemId, tokenId);
    }

    /**
     * @dev See {IERC721ReceiverUpgradeable-onERC721Received}
     */
    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external view override returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    /**
     * @dev See {IERC1155ReceiverUpgradable-onERC1155Received}
     */
    function onERC1155Received(
        address _operator,
        address _from,
        uint256 _id,
        uint256 _value,
        bytes calldata _data
    ) external view override returns (bytes4) {
        return IERC1155ReceiverUpgradeable.onERC1155Received.selector;
    }

    /**
     * @dev See {IERC1155ReceiverUpgradable-onERC1155BatchReceived}
     */
    function onERC1155BatchReceived(
        address operator,
        address from,
        uint256[] calldata ids,
        uint256[] calldata values,
        bytes calldata data
    ) external view override returns (bytes4) {
        return IERC1155ReceiverUpgradeable.onERC1155BatchReceived.selector;
    }

    /**
     * @dev See {IERC165Upgradeable-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        external
        pure
        override
        returns (bool)
    {
        return interfaceId == IERC165Upgradeable.supportsInterface.selector;
    }

    /**
     * @dev Set comission for the marketplace.
     */
    function setComission(uint8 amount) external onlyOwner {
        _comission = amount;
    }

    /**
     * @dev Set validator address
     */
    function setValidator(address validator_) external onlyOwner {
        _validator = validator_;
    }

    /**
     * @dev Withdraw comission fee
     */
    function withdrawComission() external onlyOwner {
        _WETH.transferFrom(address(this), msg.sender, _totalComissions);
    }

    /**
     * @dev Check if validator signed a data
     */
    function _validateSignature(bytes32 data, bytes memory signature)
        internal
        view
    {
        if (!_verify(data, signature, _validator)) {
            revert InvalidSignature();
        }
    }

    function _verify(
        bytes32 data,
        bytes memory signature,
        address account
    ) internal pure returns (bool) {
        return data.toEthSignedMessageHash().recover(signature) == account;
    }

    /**
     * @dev Calculate comission, royalty and transfer WETH.
     */
    function _safePayment(
        uint256 bid,
        address buyer,
        address seller,
        address asset,
        uint256 tokenId
    ) internal {
        (address receiver, uint256 royalty) = IERC2981Upgradeable(
            address(asset)
        ).royaltyInfo(tokenId, bid);

        uint256 comission_ = (bid * _comission) / 100;

        _WETH.transferFrom(buyer, seller, bid - royalty - comission_);
        _WETH.transferFrom(buyer, receiver, royalty);
        _WETH.transferFrom(buyer, address(this), comission_);

        _totalComissions += comission_;
    }

    /**
     * @dev Transfers from {_from} to {_to} a NFT.
     */
    function _safeTransfer(
        uint256 _tokenId,
        address _asset,
        address _from,
        address _to,
        uint256 _amount,
        AssetType _type
    ) internal {
        if (AssetType(_type) == AssetType.ERC721) {
            IERC721Upgradeable(_asset).safeTransferFrom(_from, _to, _tokenId);
        } else {
            IERC1155Upgradeable(_asset).safeTransferFrom(
                _from,
                _to,
                _tokenId,
                _amount,
                ""
            );
        }
    }

    function _setStatus(Status status, uint256 selllerNumeratorTypeStatus)
        internal
        pure
        returns (uint256 selllerNumeratorTypeStatusNew)
    {
        selllerNumeratorTypeStatusNew =
            selllerNumeratorTypeStatus -
            uint256(uint8(selllerNumeratorTypeStatus)) +
            (uint256(status));
    }

    function _encodeAssetPrice(address asset, uint96 price)
        internal
        pure
        returns (uint256 assetPrice)
    {
        assetPrice = (uint256(uint160(asset)) << 96) + uint256(price);
    }

    function _encodeTokenIdAmount(uint128 tokenId, uint128 amount)
        internal
        pure
        returns (uint256 tokenIdAMount)
    {
        tokenIdAMount = (uint256(tokenId) << 128) + uint256(amount);
    }

    function _encodeSellerTypeStatus(address seller, AssetType assetType)
        internal
        pure
        returns (uint256 selllerNumeratorTypeStatus)
    {
        selllerNumeratorTypeStatus =
            (uint256(uint160(seller)) << 96) +
            (uint256(assetType) << 88) +
            (uint256(Status.CREATE));
    }

    function _decodeAssetPrice(uint256 assetPrice)
        internal
        pure
        returns (address asset, uint96 price)
    {
        asset = address(uint160(assetPrice >> 96));
        price = uint96(assetPrice);
    }

    function _decodeTokenIdAmount(uint256 tokenIdAMount)
        internal
        pure
        returns (uint128 tokenId, uint128 amount)
    {
        tokenId = uint128(tokenIdAMount >> 128);
        amount = uint128(tokenIdAMount);
    }

    function _decodeSellerTypeStatus(uint256 selllerNumeratorTypeStatus)
        internal
        pure
        returns (
            address seller,
            AssetType assetType,
            Status status
        )
    {
        seller = address(uint160(selllerNumeratorTypeStatus >> 96));
        assetType = AssetType(uint8(selllerNumeratorTypeStatus >> 88));
        status = Status(uint8(selllerNumeratorTypeStatus));
    }

    function _onlyOwner(address seller, address sender) internal pure {
        if (seller != sender) {
            revert OnlyOwnerRequired();
        }
    }

    function _onlyCreatedItem(Status status) internal pure {
        if (status != Status.CREATE) {
            revert InvalidItemStatus();
        }
    }
}
