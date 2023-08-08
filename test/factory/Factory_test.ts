import { expect } from "chai";
import { Signer } from "ethers";
import { ethers } from "hardhat";
import { Factory, AssetERC1155, AssetERC721 } from "../../typechain";

describe("Factory ERC721", function () {
  let asset721: AssetERC721;
  let asset1155: AssetERC1155;
  let factory: Factory;
  let signers: Signer[];
  let validator: Signer;

  beforeEach(async () => {
    signers = await ethers.getSigners();
    validator = signers[6];

    // deploying asset
    const Factory721 = await ethers.getContractFactory("AssetERC721");
    asset721 = await Factory721.deploy();
    await asset721.deployed();

    signers = await ethers.getSigners();

    // deploying asset
    const Factory1155 = await ethers.getContractFactory("AssetERC1155");
    asset1155 = await Factory1155.deploy();
    await asset1155.deployed();

    // deploying factory
    const Factory2 = await ethers.getContractFactory("Factory");
    factory = await Factory2.deploy();
    await factory.deployed();

    await factory.initialize(
      asset721.address,
      asset1155.address,
      asset1155.address,
      await validator.getAddress()
    );
  });

  it("making clones for ERC721 asset", async () => {
    const msg1 = ethers.utils.solidityKeccak256(
      ["string", "string", "address"],
      ["name1", "symbol1", await signers[0].getAddress()]
    );
    const bytesMsg1 = ethers.utils.arrayify(msg1);
    const signature1 = await validator.signMessage(bytesMsg1);

    await factory.mint721("name1", "symbol1", signature1);
    const clone1 = await factory.assetsERC721(0);

    const assetClone1 = await ethers.getContractAt("AssetERC721", clone1);
    const name1 = await assetClone1.name();
    const symbol1 = await assetClone1.symbol();

    expect(name1).to.be.eq("name1");
    expect(symbol1).to.be.eq("symbol1");

    const msg2 = ethers.utils.solidityKeccak256(
      ["string", "string", "address"],
      ["name2", "symbol2", await signers[0].getAddress()]
    );
    const bytesMsg2 = ethers.utils.arrayify(msg2);
    const signature2 = await validator.signMessage(bytesMsg2);

    await factory.mint721("name2", "symbol2", signature2);
    const clone2 = await factory.assetsERC721(1);

    const assetClone2 = await ethers.getContractAt("AssetERC721", clone2);
    const name2 = await assetClone2.name();
    const symbol2 = await assetClone2.symbol();

    expect(name2).to.be.eq("name2");
    expect(symbol2).to.be.eq("symbol2");

    const msg3 = ethers.utils.solidityKeccak256(
      ["string", "string", "address"],
      ["name3", "symbol3", await signers[0].getAddress()]
    );
    const bytesMsg3 = ethers.utils.arrayify(msg3);
    const signature3 = await validator.signMessage(bytesMsg3);

    await factory.mint721("name3", "symbol3", signature3);
    const clone3 = await factory.assetsERC721(2);

    const assetClone3 = await ethers.getContractAt("AssetERC721", clone3);
    const name3 = await assetClone3.name();
    const symbol3 = await assetClone3.symbol();

    expect(name3).to.be.eq("name3");
    expect(symbol3).to.be.eq("symbol3");

    const amount = await factory.amountERC721();
    expect(amount).to.be.eq(3);
  });

  it("making clones for ERC1155 asset", async () => {
    const msg1 = ethers.utils.solidityKeccak256(
      ["string", "address"],
      ["fake_uri1", await signers[0].getAddress()]
    );
    const bytesMsg1 = ethers.utils.arrayify(msg1);
    const signature1 = await validator.signMessage(bytesMsg1);

    await factory.mint1155("fake_uri1", signature1);
    const clone1 = await factory.assetsERC1155(0);

    const assetClone1 = await ethers.getContractAt("AssetERC1155", clone1);
    const uri1 = await assetClone1.uri(0);

    expect(uri1).to.be.eq("authic coll" + "fake_uri1");

    const msg2 = ethers.utils.solidityKeccak256(
      ["string", "address"],
      ["fake_uri2", await signers[0].getAddress()]
    );
    const bytesMsg2 = ethers.utils.arrayify(msg2);
    const signature2 = await validator.signMessage(bytesMsg2);

    await factory.mint1155("fake_uri2", signature2);
    const clone2 = await factory.assetsERC1155(1);

    const assetClone2 = await ethers.getContractAt("AssetERC1155", clone2);
    const uri2 = await assetClone2.uri(1);

    expect(uri2).to.be.eq("authic coll" + "fake_uri2");

    const msg3 = ethers.utils.solidityKeccak256(
      ["string", "address"],
      ["fake_uri3", await signers[0].getAddress()]
    );
    const bytesMsg3 = ethers.utils.arrayify(msg3);
    const signature3 = await validator.signMessage(bytesMsg3);

    await factory.mint1155("fake_uri3", signature3);
    const clone3 = await factory.assetsERC1155(2);

    const assetClone3 = await ethers.getContractAt("AssetERC1155", clone3);
    const uri3 = await assetClone3.uri(2);

    expect(uri3).to.be.eq("authic coll" + "fake_uri3");

    const amount = await factory.amountERC1155();
    expect(amount).to.be.eq(3);
  });
});
