import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { AssetERC721 } from "../../typechain";

describe("ERC721", function () {
  let contract: AssetERC721;
  let signers: Signer[];

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("AssetERC721");
    contract = await Factory.deploy();

    await contract.deployed();

    await contract.initialize(
      "some_name",
      "some_symbol",
      await signers[0].getAddress(),
      await signers[6].getAddress()
    );
  });

  it("mint()", async () => {
    const creator_addr = await signers[1].getAddress();
    const owner = await signers[2].getAddress();

    const tx = contract.mint(creator_addr, owner, 1251, "some_uri");
    await expect(tx).to.be.revertedWith("too much fee");

    await contract.mint(creator_addr, owner, 1250, "some_uri");

    const currOwner = await contract.ownerOf(0);
    expect(currOwner).to.be.eq(owner);

    const royalty = await contract.royaltyInfo(0, 1000);
    expect(royalty[1]).to.be.eq(125);
    expect(royalty[0]).to.be.eq(creator_addr);

    const tokenURI = await contract.tokenURI(0);
    expect(tokenURI).to.be.eq("authic collection" + "some_uri");
  });

  it("supportsInterface()", async () => {
    const iface2981 = new ethers.utils.Interface([
      "function royaltyInfo(uint256 _tokenId, uint256 _salePrice)",
    ]);
    const ifaceId2981 = iface2981.getSighash("royaltyInfo");

    const iface165 = new ethers.utils.Interface([
      "function supportsInterface(bytes4 interfaceID)",
    ]);
    const ifaceId165 = iface165.getSighash("supportsInterface");

    const is165 = await contract.supportsInterface(ifaceId165);
    const is2981 = await contract.supportsInterface(ifaceId2981);

    expect(is165).to.be.true;
    expect(is2981).to.be.true;
  });
});
