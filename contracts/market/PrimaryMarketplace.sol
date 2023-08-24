//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
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

import "./primary/IAuctionPrimary.sol";
import "./primary/IBestOfferPrimary.sol";
import "./primary/IFixedPricePrimary.sol";

contract PrimaryMarketplace is
    IAuctionPrimary,
    IBestOfferPrimary,
    IFixedPricePrimary,
    Initializable,
    IERC721ReceiverUpgradeable,
    IERC1155ReceiverUpgradeable,
    OwnableUpgradeable
{
    using ECDSAUpgradeable for bytes32;

    error InvalidItemStatus();
    error OnlyOwnerRequired();
    error InvalidSignature();

    enum Status {
        UNDEFINED,
        CREATE,
        SOLD,
        CANCEL
    }

    struct AuctionItem {
        uint256 asset_price;
        uint256 tokenId_amount;
        uint256 seller_fee_type_status;
        string uri;
    }

    struct OfferItem {
        address asset;
        uint256 seller_fee_type_status;
        uint256 tokenId_amount;
        string uri;
    }

    struct FixedPriceItem {
        uint256 asset_price;
        uint256 tokenId_amount;
        uint256 seller_fee_type_status;
        string uri;
    }

    /**
     * @dev Address of WETH
     */
    IERC20 private constant _WETH =
        IERC20(0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6);

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
        _comission = comission_;//wasim

        __Ownable_init();
    }

    /**
     * @dev 
     */
    function totalComissions()
        external
        view
        returns (uint256)
    {
        return _totalComissions;
    }

    /**
     * @dev 
     */
    function comission()
        external
        view
        returns (uint8)
    {
        return _comission;
    }

    /**
     * @dev 
     */
    function validator()
        external
        view
        returns (address)
    {
        return _validator;
    }

    /**
     * @dev 
     */
    function fixedItemId()
        external
        view
        returns (uint256)
    {
        return _fixedItemId;
    }

    /**
     * @dev 
     */
    function offerItemId()
        external
        view
        returns (uint256)
    {
        return _offerItemId;
    }

    /**
     * @dev 
     */
    function auctionItemId()
        external
        view
        returns (uint256)
    {
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
            uint16 feeNumerator,
            AssetType assetType,
            Status status,
            string memory uri
        )
    {
        AuctionItem storage item = auctionItems[itemId];
        (asset, startPrice) = _decodeAssetPrice(item.asset_price);
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (seller, feeNumerator, assetType, status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        uri = item.uri;
    }

    /**
     * @dev Getter for best offer item
     */
    function getOfferItem(uint256 itemId)
        external
        view
        returns(
            address asset,
            uint128 tokenId,
            uint128 amount,
            address seller,
            uint16 feeNumerator,
            AssetType assetType,
            Status status,
            string memory uri
        )
    {
        OfferItem storage item = offerItems[itemId];
        (seller, feeNumerator, assetType, status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        uri = item.uri;
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
            uint16 feeNumerator,
            AssetType assetType,
            Status status,
            string memory uri
        )
    {
        FixedPriceItem storage item = fixedPriceItems[itemId];
        (asset, startPrice) = _decodeAssetPrice(item.asset_price);
        (tokenId, amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (seller, feeNumerator, assetType, status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        uri = item.uri;
    }

    /**
     * @dev See {IAuction-listAuction}.
     */
    function listAuction(
        address asset,
        uint96 startPrice,
        uint128 tokenId,
        uint128 amount,
        uint16 feeNumerator,
        AssetType assetType,
        string memory uri,
        bytes memory signature
    ) 
        external 
        override 
    {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                startPrice,
                amount,
                feeNumerator,
                assetType,
                uri,
                msg.sender
            )
        );
        _validateSignature(data, signature);

        AuctionItem storage item = auctionItems[_auctionItemId];
        item.uri = uri;
        item.asset_price = _encodeAssetPrice(asset, startPrice);
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_fee_type_status = _encodeSellerNumeratorTypeStatus(msg.sender, feeNumerator, assetType);

        emit ListedAuction(msg.sender, _auctionItemId);

        _auctionItemId++;
    }

    /**
     * @dev See {IBestOfferPrimary-listItem}
     */
    function listOfferItem(
        address asset,
        uint128 tokenId,
        uint128 amount,
        uint16 feeNumerator,
        AssetType assetType,
        string memory uri,
        bytes memory signature
    ) 
        external 
        override 
    {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                amount,
                feeNumerator,
                assetType,
                uri,
                msg.sender
            )
        );
        _validateSignature(data, signature);

        OfferItem storage item = offerItems[_offerItemId];
        item.uri = uri;
        item.asset = asset;
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_fee_type_status = _encodeSellerNumeratorTypeStatus(msg.sender, feeNumerator, assetType);

        emit ListedOffer(msg.sender, _offerItemId);

        _offerItemId++;
    }

    /**
     * @dev See {IFixedPrice-listItemFixedPrice}.
     */
    function listItemFixedPrice(
        address asset,
        uint96 price,
        uint128 tokenId,
        uint128 amount,
        uint16 feeNumerator,
        AssetType assetType,
        string memory uri,
        bytes memory signature
    ) 
        external 
        override 
    {
        bytes32 data = keccak256(
            abi.encodePacked(
                asset,
                tokenId,
                price,
                amount,
                feeNumerator,
                assetType,
                uri,
                msg.sender
            )
        );
        _validateSignature(data, signature);

        FixedPriceItem storage item = fixedPriceItems[_fixedItemId];
        item.uri = uri;
        item.asset_price = _encodeAssetPrice(asset, price);
        item.tokenId_amount = _encodeTokenIdAmount(tokenId, amount);
        item.seller_fee_type_status = _encodeSellerNumeratorTypeStatus(msg.sender, feeNumerator, assetType);

        emit ListedFixedPrice(msg.sender, _fixedItemId);

        _fixedItemId++;
    }

    /**
     * @dev See {IAuction-finishAuction}.
     */
    function finishAuction(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) 
        external 
        override
    {
        bytes32 _data = keccak256(abi.encodePacked(itemId, bid, buyer));
        _validateSignature(_data, signature);

        AuctionItem storage item = auctionItems[itemId];
        (address asset, uint256 price) = _decodeAssetPrice(item.asset_price);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (
            address seller, 
            uint16 feeNumerator,
            AssetType assetType,
            Status status
        ) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        _safePayment(bid, buyer, seller);
        _safeMint(
            buyer,
            seller,
            feeNumerator,
            asset,
            amount,
            tokenId,
            item.uri,
            assetType
        );

        item.seller_fee_type_status = _setStatus(Status.SOLD, item.seller_fee_type_status);

        emit FinishedAuction(itemId, bid, seller);
    }

    /**
     * @dev See {IBestOffer-acceptOffer}.
     */
    function acceptOffer(
        uint256 itemId,
        uint256 bid,
        address buyer,
        bytes memory signature
    ) 
        external 
        override 
    {
        bytes32 _data = keccak256(abi.encodePacked(itemId, bid, buyer));
        _validateSignature(_data, signature);

        OfferItem storage item = offerItems[itemId];
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (
            address seller,
            uint16 feeNumerator,
            AssetType assetType,
            Status status
        ) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        _safePayment(bid, buyer, seller);
        _safeMint(
            buyer,
            seller,
            uint16(feeNumerator),
            item.asset,
            amount,
            tokenId,
            item.uri,
            assetType
        );

        item.seller_fee_type_status = _setStatus(Status.SOLD, item.seller_fee_type_status);

        emit AcceptedOffer(itemId, buyer, bid);
    }

    /**
     * @dev See {IFixedPrice-buyItemFixedPrice}.
     */
    function buyItemFixedPrice(uint256 itemId)
        external
        override
    {
        FixedPriceItem storage item = fixedPriceItems[itemId];
        (address asset, uint256 price) = _decodeAssetPrice(item.asset_price);
        (uint128 tokenId, uint128 amount) = _decodeTokenIdAmount(item.tokenId_amount);
        (
            address seller, 
            uint16 feeNumerator,
            AssetType assetType,
            Status status
        ) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);

        _onlyCreatedItem(status);

        _safePayment(price, msg.sender, seller);
        _safeMint(
            msg.sender,
            seller,
            feeNumerator,
            asset,
            amount,
            tokenId,
            item.uri,
            assetType
        );

        item.seller_fee_type_status = _setStatus(Status.SOLD, item.seller_fee_type_status);

        emit BoughtFixedPrice(itemId, msg.sender);
    }

    /**
     * @dev See {IAuction-cancelAuction}.
     */
    function cancelAuction(uint256 itemId) 
        external 
        override 
    {
        AuctionItem storage item = auctionItems[itemId];

        (address seller,,,Status status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        (uint128 tokenId,) = _decodeTokenIdAmount(item.tokenId_amount);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        item.seller_fee_type_status = _setStatus(Status.CANCEL, item.seller_fee_type_status);

        emit CanceledAuction(itemId, tokenId);
    }

    /**
     * @dev See {IBestOffer-unlistItem}
     */
    function unlistOfferItem(uint256 itemId) 
        external 
        override 
    {
        OfferItem storage item = offerItems[itemId];

        (address seller,,,Status status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        (uint128 tokenId,) = _decodeTokenIdAmount(item.tokenId_amount);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        item.seller_fee_type_status = _setStatus(Status.CANCEL, item.seller_fee_type_status);

        emit UnlistedOffer(itemId, tokenId);
    }

    /**
     * @dev See {IFixedPrice-}
     */
    function unlistItemFixedPrice(uint256 itemId) 
        external 
        override 
    {
        FixedPriceItem storage item = fixedPriceItems[itemId];

        (address seller,,,Status status) = _decodeSellerNumeratorTypeStatus(item.seller_fee_type_status);
        (uint128 tokenId,) = _decodeTokenIdAmount(item.tokenId_amount);

        _onlyCreatedItem(status);
        _onlyOwner(seller, msg.sender);

        item.seller_fee_type_status = _setStatus(Status.CANCEL, item.seller_fee_type_status);

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
    ) 
        external 
        view 
        override 
        returns (bytes4) 
    {
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
    ) 
        external 
        view 
        override 
        returns (bytes4) 
    {
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
    ) 
        external 
        view 
        override 
        returns (bytes4) 
    {
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
    function setComission(uint8 amount) 
        external 
        onlyOwner 
    {
        _comission = amount;
    }

    /**
     * @dev Set validator address
     */
    function setValidator(address validator_) 
        external 
        onlyOwner 
    {
        _validator = validator_;
    }

    /**
     * @dev Withdraw comission fee
     */
    function withdrawComission() 
        external 
        onlyOwner 
    {
        _WETH.transferFrom(address(this), msg.sender, _totalComissions);
    }

    function withdrawERC20(address asset, uint256 amount)
        external
        onlyOwner
    {
        IERC20(asset).transfer(msg.sender, amount);
    }

    function withdrawERC721(address asset, uint256 tokenId)
        external
        onlyOwner
    {
        IERC721Upgradeable(asset).transferFrom(address(this), msg.sender, tokenId);
    }

    function withdrawERC1155(
        address asset,
        uint256[] memory tokenIds,
        uint256[] memory amounts
    )
        external
        onlyOwner
    {
        IERC1155Upgradeable(asset).safeBatchTransferFrom(address(this), msg.sender, tokenIds, amounts, "");
    }

    /**
     * @dev Calculate comission, royalty and transfer WETH.
     */
    function _safePayment(
        uint256 bid,
        address buyer,
        address seller
    ) 
        internal 
    {
        uint256 comissions = (bid * _comission) / 100;

        _WETH.transferFrom(buyer, seller, bid - comissions);
        _WETH.transferFrom(buyer, address(this), comissions);
        _totalComissions += comissions;
    }

    /**
     * @dev Mint token to the buyer
     *
     * NOTE: Lazy mint implementation.
     */
    function _safeMint(
        address to,
        address seller,
        uint16 feeNumerator,
        address asset,
        uint256 amount,
        uint256 tokenId,
        string memory uri,
        AssetType assetType
    ) 
        internal 
    {    
        if (assetType == AssetType.ERC721) {
            IAssetERC721(asset).mint(
                seller, // creator
                to,
                feeNumerator,
                uri
            );
        } else {
            IAssetERC1155(asset).mint(
                seller, // creator
                to,
                tokenId,
                amount,
                "",
                feeNumerator
            );
        }
    }

    /**
     * @dev
     */
    function _validateSignature(bytes32 data, bytes memory signature)
        internal
        view
    {
        if(!_verify(data, signature, _validator)) {
            revert InvalidSignature();
        }
    }

    /**
     * @dev For verifying if the validator signed a signature.
     */
    function _verify(
        bytes32 data,
        bytes memory signature,
        address account
    ) 
        internal 
        pure 
        returns (bool) 
    {
        return data.toEthSignedMessageHash().recover(signature) == account;
    }

    function _setStatus(Status status, uint256 selllerNumeratorTypeStatus)
        internal
        pure
        returns (uint256 selllerNumeratorTypeStatusNew)
    {
        selllerNumeratorTypeStatusNew = selllerNumeratorTypeStatus - uint256(uint8(selllerNumeratorTypeStatus)) + (uint256(status));
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

    function _encodeSellerNumeratorTypeStatus(address seller, uint16 feeNumerator, AssetType assetType)
        internal
        pure
        returns (uint256 selllerNumeratorTypeStatus)
    {
        selllerNumeratorTypeStatus = 
            (uint256(uint160(seller)) << 96) + 
            (uint256(feeNumerator) << 80) + 
            (uint256(assetType) << 72) + 
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

    function _decodeSellerNumeratorTypeStatus(uint256 selllerNumeratorTypeStatus)
        internal
        pure
        returns (address seller, uint16 feeNumerator, AssetType assetType, Status status)
    {
        seller = address(uint160(selllerNumeratorTypeStatus >> 96));
        feeNumerator = uint16(selllerNumeratorTypeStatus >> 80);
        assetType = AssetType(uint8(selllerNumeratorTypeStatus >> 72));
        status = Status(uint8(selllerNumeratorTypeStatus));
    }

    function _onlyOwner(address seller, address sender) 
        internal 
        pure 
    {
        if(seller != sender) {
            revert OnlyOwnerRequired();
        }
    }

    function _onlyCreatedItem (Status status) internal pure {
        if(status != Status.CREATE) {
            revert InvalidItemStatus();
        }
    }
}
