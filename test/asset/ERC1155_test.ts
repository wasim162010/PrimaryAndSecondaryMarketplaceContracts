import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { AssetERC1155 } from "../../typechain";

describe("ERC1155", function () {
  let contract: AssetERC1155;
  let signers: Signer[];

  beforeEach(async () => {
    signers = await ethers.getSigners();

    const Factory = await ethers.getContractFactory("AssetERC1155");
    contract = await Factory.deploy();

    await contract.deployed();

    await contract.initialize(
      "some_uri",
      await signers[0].getAddress(),
      await signers[7].getAddress()
    );
  });

  it("mint()", async () => {
    const creator_addr = await signers[1].getAddress();
    const owner = await signers[2].getAddress();

    const data = ethers.utils.toUtf8Bytes("");
    const tx = contract.mint(creator_addr, owner, 0, 1, data, 1251);
    await expect(tx).to.be.revertedWith("too much fee");

    const id = 0;
    const amount = 7;
    const fee = 1250;

    await contract.mint(creator_addr, owner, id, amount, data, fee);

    const balance = await contract.balanceOfBatch([owner], [id]);

    expect(balance[0]).to.be.eq(amount);

    const royalty = await contract.royaltyInfo(0, 1000);
    expect(royalty[1]).to.be.eq(125);
    expect(royalty[0]).to.be.eq(creator_addr);
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
