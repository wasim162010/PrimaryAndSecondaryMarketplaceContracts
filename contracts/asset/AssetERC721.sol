//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC721/extensions/ERC721URIStorageUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "./IAssetERC721.sol";
import "hardhat/console.sol";

/**
 * @dev Implementation of the ERC721 Asset Collection.
 */
contract AssetERC721 is
    IAssetERC721,
    ERC721URIStorageUpgradeable,
    ERC2981Upgradeable,
    AccessControlUpgradeable
{
    /**
     * @dev Minter role gives permission to mint.
     */
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");

    /**
     * @dev Maximum allowed numerator for royalty.
     */
    uint96 public constant MAX_FEE_NUMERATOR = 1250;

    /**
     * @dev 
     */
    uint256 public tokenId;

    /**
     * @dev Constructor function for clones.
     * NOTE: Can be called just once.
     */
    function initialize(
        string memory name_,
        string memory symbol_,
        address creator,
        address marketplace
    ) external override initializer {
        _setupRole(MINTER_ROLE, marketplace);
        _setupRole(MINTER_ROLE, creator);
        __ERC721_init(name_, symbol_);
    }

    /**
     * @dev Mint NFT with setting royalty.
     */
    function mint(
        address creator,
        address to,
        uint96 feeNumerator,
        string memory uri
    ) external override onlyRole(MINTER_ROLE) {
        require(feeNumerator <= MAX_FEE_NUMERATOR, "too much fee");

        _safeMint(to, tokenId);
        _setTokenRoyalty(tokenId, creator, feeNumerator);
        _setTokenURI(tokenId, uri);

        tokenId++;
    }

    /**
     * @dev Check if contract support some interface by id.
     */
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC721Upgradeable,
            ERC2981Upgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return
            type(IAssetERC721).interfaceId == interfaceId ||
            super.supportsInterface(interfaceId);
    }

    /**
     * @dev Return base uri for token URI's.
     */
    function _baseURI() internal pure override returns (string memory) {
        return "authic collection";
    }
}
