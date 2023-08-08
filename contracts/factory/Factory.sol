//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/proxy/ClonesUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/cryptography/ECDSAUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/introspection/ERC165Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "./IFactoryERC721.sol";
import "./IFactoryERC1155.sol";
import "./../asset/AssetERC721.sol";
import "./../asset/AssetERC1155.sol";

/**
 * @dev Implementation of the factory for ERC1155 assets.
 */
contract Factory is
    IFactoryERC721,
    IFactoryERC1155,
    Initializable,
    ERC165Upgradeable
{
    using ECDSAUpgradeable for bytes32;

    error InvalidSignature();

    /**
     * @dev Array of ERC721 minimal proxies cloned by factory.
     */
    address[] private _assetsERC721;

    /**
     * @dev Amount of ERC721 assets, created by factory.
     */
    uint256 private _amountERC721;

    /**
     * @dev Array of ERC1155 minimal proxies cloned by factory.
     */
    address[] private _assetsERC1155;

    /**
     * @dev Amount of ERC1155 assets, created by factory.
     */
    uint256 private _amountERC1155;

    /**
     * @dev Used for making minimal proxies for ERC721 asset.
     */
    address private _assetERC721;

    /**
     * @dev Used for making minimal proxies for ERC1155 asset.
     */
    address private _assetERC1155;

    /**
     * @dev Address of the marketplace
     */
    address private _marketplace;

    /**
     * @dev Address of the validator wallet for ecrecover.
     */
    address private _validator;

    /**
     * @dev Prefix for token URI.
     */
    string private constant PREFIX = "authic coll";

    /**
     * @dev Constructor function for clones.
     * NOTE: Can be called just once.
     */
    function initialize(
        address assetERC721_,
        address assetERC1155_,
        address marketplace_,
        address validator_
    ) 
        external 
        initializer 
    {
        _assetERC721 = assetERC721_;
        _assetERC1155 = assetERC1155_;
        _marketplace = marketplace_;
        _validator = validator_;
    }

    function assetsERC721(uint256 id) //wasim
        external 
        view
        returns (address)
    {
        return _assetsERC721[id];
    }

    function amountERC721()
        external
        view
        returns (uint256)
    {
        return _amountERC721;
    }

    function assetsERC1155(uint256 id)
        external
        view
        returns (address)
    {
        return _assetsERC1155[id];
    }

    function amountERC1155()
        external
        view
        returns (uint256)
    {
        return _amountERC1155;
    }

    function assetERC721()
        external
        view
        returns (address)
    {
        return _assetERC721;
    }

    function assetERC1155()
        external
        view
        returns (address)
    {
        return _assetERC1155;
    }

    function marketplace()
        external
        view
        returns (address)
    {
        return _marketplace;
    }

    function validator()
        external
        view
        returns (address)
    {
        return _validator;
    }

    /**
     * @dev See {IFactoryERC1155-mint721}
     */
    function mint721( //wasim
        string memory name,
        string memory symbol,
        bytes memory signature
    ) 
        external 
        override 
    {
        bytes32 data = keccak256(abi.encodePacked(name, symbol, msg.sender));
        _validateSignature(data, signature);

        address clone = ClonesUpgradeable.clone(_assetERC721);
        AssetERC721(clone).initialize(name, symbol, msg.sender, _marketplace);
        _assetsERC721.push(clone);

        _amountERC721++;

        emit MintedERC721(msg.sender, name, symbol, clone);
    }

    /**
     * @dev See {IFactoryERC1155-mint1155}
     */
    function mint1155(string memory uri, bytes memory signature)
        external
        override
    {
        bytes32 data = keccak256(abi.encodePacked(uri, msg.sender));
        _validateSignature(data, signature);

        string memory URI = string(abi.encodePacked(PREFIX, uri));
        address clone = ClonesUpgradeable.clone(_assetERC1155);
        AssetERC1155(clone).initialize(URI, msg.sender, _marketplace);
        _assetsERC1155.push(clone);

        _amountERC1155++;

        emit MintedERC1155(URI, msg.sender, clone);
    }

    /**
     * @dev See {ERC165Upgradeable-supportsInterface}
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IFactoryERC721).interfaceId ||
            interfaceId == type(IFactoryERC1155).interfaceId ||
            super.supportsInterface(interfaceId);
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
    ) internal pure returns (bool) {
        return data.toEthSignedMessageHash().recover(signature) == account;
    }
}
