//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts/interfaces/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC1155.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "./IFixedPriceSecondary.sol";

contract FixedPriceMarketplace is
    // IFixedPrice,
    Initializable,
    IERC721ReceiverUpgradeable,
    IERC1155ReceiverUpgradeable
{
    using ECDSA for bytes32;
    using Counters for Counters.Counter;

    enum Status {
        undefined,
        CREATE,
        SOLD,
        CANCEL
    }

    enum AssetType {
        undefined,
        ERC721,
        ERC1155
    }

    struct FixedPriceItem {
        address asset;
        address seller;
        uint256 tokenId;
        uint256 price;
        uint256 amount;
        AssetType assetType;
        Status status;
    }

    /**
     * @dev Address of WETH
     */
    IERC20 private _weth;

    /**
     * @dev ID that represents amount of items.
     */
    Counters.Counter public auctionItemId;

    /**
     * @dev Validator for signing transactions.
     */
    address public validator;

    /**
     * @dev Comission to the marketplace.
     */
    uint256 public comission;

    /**
     * @dev Mappig from item ID to item.
     */
    mapping(uint256 => FixedPriceItem) public fixedPriceItems;

    /**
     * @dev Constructor for upgradable contract.
     */
    function initialize(
        address validator_,
        uint256 comission_,
        address weth_
    ) external initializer {
        validator = validator_;
        comission = comission_;
        _weth = IERC20(weth_);
    }

    /**
     * @dev See {IFixedPrice-listItemFixedPrice}.
     */
    function listItemFixedPrice(
        address asset,
        uint256 price,
        uint256 tokenId,
        uint256 amount,
        AssetType assetType,
        bytes memory signature
    ) external {
        if (assetType == AssetType.ERC721) {
            require(amount == 1, "ERC721 amount should be equal 1");
        }

        uint256 itemId = auctionItemId.current();

        bytes32 _data = keccak256(
            abi.encodePacked(asset, itemId, price, tokenId)
        );

        require(_verify(_data, signature, validator), "invalid signature");

        FixedPriceItem storage item = fixedPriceItems[itemId];
        item.assetType = assetType;
        item.asset = asset;
        item.seller = msg.sender;

        item.tokenId = tokenId;
        item.amount = amount;
        item.price = price;
        item.status = Status.CREATE;

        auctionItemId.increment();

        // emit ListedFixedPrice(asset, msg.sender, tokenId, price);
    }

    /**
     * @dev See {IFixedPrice-buyItemFixedPrice}.
     */
    function buyItemFixedPrice(uint256 itemId) external {
        FixedPriceItem storage item = fixedPriceItems[itemId];
        require(item.status == Status.CREATE, "Item can't be bought");

        _safePayment(itemId, item.price, msg.sender);
        _safeTransfer(
            item.tokenId,
            item.asset,
            item.seller,
            msg.sender,
            item.amount,
            item.assetType
        );

        item.status = Status.SOLD;

        // emit BoughtFixedPrice(itemId, item.asset, msg.sender, item.tokenId);
    }

    /**
     * @dev See {IFixedPrice-}
     */
    function unlistItemFixedPrice(uint256 itemId) external {
        FixedPriceItem storage item = fixedPriceItems[itemId];

        require(item.status == Status.CREATE, "Item can't be unlisted");
        require(item.seller == msg.sender, "only owner can unlist");

        item.status = Status.CANCEL;

        // emit UnlistedFixedPrice(itemId, item.asset, item.tokenId);
    }

    /**
     * @dev See {IERC721ReceiverUpgradeable-onERC721Received}.
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
     * @dev See {IERC1155ReceiverUpgradable-onERC1155Received}.
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
     * @dev See {IERC1155ReceiverUpgradable-onERC1155BatchReceived}.
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
        view
        override
        returns (bool)
    {
        return interfaceId == IERC165Upgradeable.supportsInterface.selector;
    }

    /**
     * @dev Set comission for the marketplace.
     */
    function setComission(uint256 amount) external {
        comission = amount;
    }

    /**
     * @dev Set validator address
     */
    function setValidator(address validator_) external {
        validator = validator_;
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
            IERC721(_asset).transferFrom(_from, _to, _tokenId);
        } else {
            IERC1155(_asset).safeTransferFrom(_from, _to, _tokenId, _amount, "");
        }
    }

    /**
     * @dev For verifying if the validator signed a signature.
     */
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
        uint256 itemId,
        uint256 bid,
        address buyer
    ) internal {
        FixedPriceItem storage item = fixedPriceItems[itemId];

        address receiver;
        uint256 royalty;

        (receiver, royalty) = IERC2981Upgradeable(address(item.asset))
            .royaltyInfo(item.tokenId, bid);

        uint256 _comission = (bid * comission) / 100;

        _weth.transferFrom(buyer, item.seller, bid - royalty - _comission);
        _weth.transferFrom(buyer, receiver, royalty);
        _weth.transferFrom(buyer, address(this), _comission);
    }
}
