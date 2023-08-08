//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/interfaces/IERC20.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155ReceiverUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC2981Upgradeable.sol";
import "./IAuctionSecondary.sol";

import "hardhat/console.sol";

contract AuctionMarketplace is
    // IAuction,
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

    struct AuctionItem {
        address asset;
        address seller;
        uint256 tokenId;
        uint256 amount;
        uint256 step;
        uint256 endAuction;
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
    mapping(uint256 => AuctionItem) public auctionItems;

    /**
     * @dev Constructor for upgradable contract
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
     * @dev See {IAuction-listAuction721}.
     */
    function listAuction(
        address asset,
        uint256 startPrice,
        uint256 step,
        uint256 tokenId,
        uint256 amount,
        uint8 auctionDuration,
        AssetType assetType,
        bytes memory signature
    ) external {
        if (assetType == AssetType.ERC721) {
            require(amount == 1, "ERC721 amount should be equal 1");
        }

        uint256 itemId = auctionItemId.current();

        bytes32 _data = keccak256(
            abi.encodePacked(
                asset,
                itemId,
                startPrice,
                step,
                tokenId,
                auctionDuration
            )
        );
        require(_verify(_data, signature, validator), "invalid signature");

        _safeTransfer(
            tokenId,
            asset,
            msg.sender,
            address(this),
            amount,
            assetType
        );

        AuctionItem storage item = auctionItems[itemId];
        item.assetType = assetType;
        item.asset = asset;
        item.seller = msg.sender;

        item.tokenId = tokenId;
        item.amount = amount;

        item.step = step;
        item.endAuction = block.timestamp + auctionDuration * 86400;
        item.status = Status.CREATE;

        auctionItemId.increment();

        // emit ListedAuction(tokenId, startPrice, msg.sender);
    }

    /**
     * @dev See {IAuction-finishAuction}.
     */
    function finishAuction(
        uint256 itemId,
        uint256 bid,
        address buyer
    ) external {
        AuctionItem storage item = auctionItems[itemId];

        require(item.status == Status.CREATE, "item can't be finished");
        require(item.seller == msg.sender, "only seller can finish");
        require(
            block.timestamp >= item.endAuction,
            "not enough time has passed"
        );

        _safePayment(itemId, bid, buyer);

        _safeTransfer(
            item.tokenId,
            item.asset,
            address(this),
            buyer,
            item.amount,
            item.assetType
        );

        item.status = Status.SOLD;

        // emit FinishedAuction(item.tokenId, bid, item.seller);
    }

    /**
     * @dev See {IAuction-cancelAuction}.
     */
    function cancelAuction(uint256 itemId) external {
        AuctionItem storage item = auctionItems[itemId];

        require(item.status == Status.CREATE, "item can't be canceled");
        require(item.seller == msg.sender, "only owner can cancel");

        _safeTransfer(
            item.tokenId,
            item.asset,
            address(this),
            item.seller,
            item.amount,
            item.assetType
        );

        item.status = Status.CANCEL;

        // emit CanceledAuction(item.tokenId, item.seller);
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
     * @dev Calculate comission, royalty and transfer WETH.
     */
    function _safePayment(
        uint256 itemId,
        uint256 bid,
        address buyer
    ) internal {
        AuctionItem storage item = auctionItems[itemId];

        address receiver;
        uint256 royalty;

        (receiver, royalty) = IERC2981Upgradeable(address(item.asset))
            .royaltyInfo(item.tokenId, bid);

        uint256 _comission = (bid * comission) / 100;

        _weth.transferFrom(buyer, item.seller, bid - royalty - _comission);
        _weth.transferFrom(buyer, receiver, royalty);
        _weth.transferFrom(buyer, address(this), _comission);
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
            IERC721Upgradeable(_asset).transferFrom(_from, _to, _tokenId);
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
}
