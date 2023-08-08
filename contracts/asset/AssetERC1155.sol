//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC1155/ERC1155Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/interfaces/IERC1155MetadataURIUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/common/ERC2981Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";

contract AssetERC1155 is
    ERC1155Upgradeable,
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
     * @dev Constructor function for clones.
     * NOTE: Could be called just once.
     */
    function initialize(
        string memory uri_,
        address creator,
        address marketplace
    ) external initializer {
        _setupRole(MINTER_ROLE, creator);
        _setupRole(MINTER_ROLE, marketplace);
        __ERC1155_init(uri_);
    }

    /**
     * @dev Mint NFT with setting royalty.
     */
    function mint(
        address creator,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data,
        uint96 feeNumerator
    ) external onlyRole(MINTER_ROLE) {
        require(feeNumerator <= MAX_FEE_NUMERATOR, "too much fee");

        _mint(to, id, amount, data);
        _setDefaultRoyalty(creator, feeNumerator);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(
            ERC1155Upgradeable,
            ERC2981Upgradeable,
            AccessControlUpgradeable
        )
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
