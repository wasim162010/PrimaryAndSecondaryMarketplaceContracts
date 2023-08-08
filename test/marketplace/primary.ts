import { expect } from "chai";
import { beforeEach } from "mocha";

import { ethers, network } from "hardhat";
import { Signer } from "ethers";
import {
  PrimaryMarketplace,
  AssetERC1155,
  AssetERC721,
  ERC20,
} from "../../typechain";

describe("Primary marketplace", function () {
  let marketplace: PrimaryMarketplace;
  let weth: ERC20;

  let asset721: AssetERC721;
  let asset1155: AssetERC1155;

  let signers: Signer[];
  let validator: Signer;
  let holder: Signer;
  let bidder1: Signer;
  let bidder3: Signer;

  const invalidSignature: string = "InvalidSignature()";
  const onlyOwner: string = "OnlyOwnerRequired()";
  const invalidItemStatus: string = "InvalidItemStatus()";

  beforeEach(async () => {
    signers = await ethers.getSigners();
    validator = signers[1];

    bidder1 = signers[2];
    bidder3 = signers[4];

    const holderAddr = "0x32fe8EA5D0B3c919F2AF1b5A932495c74680Ba06";
    await ethers.provider.send("hardhat_impersonateAccount", [holderAddr]);
    holder = await ethers.getSigner(holderAddr);

    weth = await ethers.getContractAt(
      "WETH",
      "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    );

    await bidder3.sendTransaction({
      to: await holder.getAddress(),
      value: ethers.utils.parseEther("100"),
    });
    await weth.connect(holder).transfer(await bidder3.getAddress(), 200);

    const marketplaceFactory = await ethers.getContractFactory(
      "PrimaryMarketplace"
    );
    marketplace = await marketplaceFactory.deploy();
    await marketplace.deployed();

    await marketplace.initialize(await validator.getAddress(), 3);

    const asset721Factory = await ethers.getContractFactory("AssetERC721");
    asset721 = await asset721Factory.deploy();
    await asset721.deployed();

    await asset721.initialize(
      "name",
      "symbol",
      await signers[0].getAddress(),
      marketplace.address
    );

    const asset1155Factory = await ethers.getContractFactory("AssetERC1155");
    asset1155 = await asset1155Factory.deploy();
    await asset1155.deployed();

    await asset1155.initialize(
      "uri",
      await signers[0].getAddress(),
      marketplace.address
    );

    await weth.connect(bidder3).approve(marketplace.address, 200);
  });

  it("hardhat_reset", async function () {
    await network.provider.request({
      method: "hardhat_reset",
      params: [
        {
          forking: {
            jsonRpcUrl:
              "https://eth-mainnet.alchemyapi.io/v2/eiHGV7GSQsE2weu_DU-Of12-rNN6-Oca",
            blockNumber: 14765788,
          },
        },
      ],
    });
  });

  describe("AUCTION", function () {
    it("Listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          5,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          5,
          7,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.listAuction(
        asset721.address,
        5, // startPrice
        1, // tokenId
        7, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        fakeSignature
      );
      await expect(tx).to.be.revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      await expect(tx).to.emit(marketplace, "ListedAuction");

      // getter for auction items
      const [
        asset,
        price,
        tokenId,
        amount,
        seller,
        numerator,
        assetType,
        status,
        uri,
      ] = await marketplace.getAuctionItem(0);

      expect(asset).eq(asset721.address);
      expect(price).eq(5);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(numerator).eq(1250);
      expect(assetType).eq(1);
      expect(status).to.be.eq(1);
      expect(uri).eq("URI");
    });

    it("Cancel listing...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          5,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      // Seller decided to cancel listing...

      let tx = marketplace.connect(signers[6]).cancelAuction(1);
      await expect(tx).to.be.revertedWith(invalidItemStatus);

      tx = marketplace.connect(signers[5]).cancelAuction(0);
      await expect(tx).to.be.revertedWith(onlyOwner);

      tx = marketplace.connect(signers[6]).cancelAuction(0);
      await expect(tx).to.emit(marketplace, "CanceledAuction");

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      tx = marketplace
        .connect(signers[6])
        .finishAuction(0, 100, await bidder3.getAddress(), realSignature);
      await expect(tx).revertedWith(invalidItemStatus);
    });

    it("Buying ERC721 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          5,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      // Some user want to buy NFT

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [1, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      const tx = marketplace
        .connect(signers[6])
        .finishAuction(1, 100, await bidder3.getAddress(), realSignature);
      await expect(tx).revertedWith(invalidItemStatus);

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      // time is going...
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);

      const balanceBefore = await weth.balanceOf(await bidder3.getAddress());

      await marketplace
        .connect(signers[6])
        .finishAuction(0, 100, await bidder3.getAddress(), realSignature);

      const balanceAfter = await weth.balanceOf(await bidder3.getAddress());
      const ownerAfter = await asset721.ownerOf(0);

      expect(balanceBefore.sub(balanceAfter)).to.be.eq(100);

      expect(ownerAfter).to.be.eq(await bidder3.getAddress());

      expect(await weth.balanceOf(marketplace.address)).to.be.eq(3); // COMISSION

      expect(await weth.balanceOf(await signers[6].getAddress())).to.be.eq(97);
    });

    it("Buying ERC1155 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset1155.address,
          0,
          5,
          3,
          1250,
          2,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset1155.address,
        5, // startPrice
        0, // tokenId
        3, // amount
        1250, // feeNumerator
        2, // type
        "URI",
        realSignature
      );

      // Some user decided to buy a batch of tokens

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      // time is going...
      await ethers.provider.send("evm_increaseTime", [86400]);
      await ethers.provider.send("evm_mine", []);

      await marketplace
        .connect(signers[6])
        .finishAuction(0, 100, await bidder3.getAddress(), realSignature);

      const afterBalance = await asset1155.balanceOf(
        await bidder3.getAddress(),
        0
      );

      expect(afterBalance).to.be.eq(3);
    });
  });

  describe("BEST OFFER", function () {
    it("Listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [asset721.address, 0, 1, 1250, 1, "URI", await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(["uint8"], [1]);
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.listOfferItem(
        asset721.address,
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        fakeSignature
      );
      await expect(tx).to.be.revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );
      await expect(tx).emit(marketplace, "ListedOffer");

      // // getter for best offer item
      const [
        asset,
        tokenId,
        amount,
        seller,
        feeNumerator,
        assetType,
        status,
        uri,
      ] = await marketplace.getOfferItem(0);

      expect(asset).eq(asset721.address);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(feeNumerator).eq(1250);
      expect(assetType).eq(1);
      expect(status).eq(1);
      expect(uri).eq("URI");
    });

    it("Cancel listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [asset721.address, 0, 1, 1250, 1, "URI", await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      // seller decided to cancel item

      let tx = marketplace.unlistOfferItem(1);

      await expect(tx).to.be.revertedWith(invalidItemStatus);

      tx = marketplace.unlistOfferItem(0);

      await expect(tx).to.be.revertedWith(onlyOwner);

      tx = marketplace.connect(signers[6]).unlistOfferItem(0);

      await expect(tx).to.emit(marketplace, "UnlistedOffer");

      // status.SOLD (3)
      const [, , , , , , status] = await marketplace.getOfferItem(0);

      expect(status).eq(3);
    });

    it("Buying ERC721 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [asset721.address, 0, 1, 1250, 1, "URI", await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      // some user want to buy a NFT

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [1, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      let tx = marketplace.acceptOffer(
        1,
        100,
        await bidder3.getAddress(),
        realSignature
      );
      await expect(tx).to.be.revertedWith(invalidItemStatus);

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      tx = marketplace.acceptOffer(
        0,
        100,
        await bidder3.getAddress(),
        realSignature
      );
      await expect(tx).to.be.revertedWith(onlyOwner);

      const balanceBefore = await weth.balanceOf(await bidder3.getAddress());
      const balanceOwnerBefore = await weth.balanceOf(
        await signers[6].getAddress()
      );

      await marketplace
        .connect(signers[6])
        .acceptOffer(0, 100, await bidder3.getAddress(), realSignature);

      let balanceAfter = await weth.balanceOf(await bidder3.getAddress());
      const ownerAfter = await asset721.ownerOf(0);

      expect(balanceBefore.sub(balanceAfter)).to.be.eq(100);

      expect(ownerAfter).to.be.eq(await bidder3.getAddress());

      expect(await weth.balanceOf(marketplace.address)).to.be.eq(3); // COMISSION

      balanceAfter = await weth.balanceOf(await signers[6].getAddress());
      expect(balanceAfter).to.be.eq(balanceOwnerBefore.add(97));
    });

    it("Buying ERC1155 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [asset1155.address, 0, 3, 1250, 2, "URI", await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset1155.address,
        0, // tokenId
        3, // amount
        1250, // feeNumerator
        2, // type
        "URI",
        realSignature
      );

      // some user wants to buy a NFT

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, await bidder3.getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      await marketplace
        .connect(signers[6])
        .acceptOffer(0, 100, await bidder3.getAddress(), realSignature);

      const balanceAfter = await asset1155.balanceOf(
        await bidder3.getAddress(),
        0
      );
      expect(balanceAfter).to.be.eq(3);
    });
  });

  describe("FIXED PRICE", function () {
    it("Listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          100,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(["uint8"], [1]);
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        100, // price
        0, // tokenId
        100, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        fakeSignature
      );
      await expect(tx).revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        100, // price
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );
      await expect(tx).emit(marketplace, "ListedFixedPrice");

      const [
        asset,
        price,
        tokenId,
        amount,
        seller,
        feeNumerator,
        assetType,
        status,
        uri,
      ] = await marketplace.getFixedPriceItem(0);

      expect(asset).eq(asset721.address);
      expect(price).eq(100);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(feeNumerator).eq(1250);
      expect(assetType).eq(1);
      expect(status).eq(1);
      expect(uri).eq("URI");
    });

    it("Cancel listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          100,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        100, // price
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      let tx = marketplace.connect(signers[2]).unlistItemFixedPrice(0);
      await expect(tx).revertedWith(onlyOwner);

      // seller decided to cancel listing

      tx = marketplace.connect(signers[6]).unlistItemFixedPrice(1);
      await expect(tx).revertedWith(invalidItemStatus);

      tx = marketplace.connect(signers[6]).unlistItemFixedPrice(0);
      await expect(tx).emit(marketplace, "UnlistedFixedPrice");
    });

    it("Buying ERC721 item...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset721.address,
          0,
          100,
          1,
          1250,
          1,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        100, // price
        0, // tokenId
        1, // amount
        1250, // feeNumerator
        1, // type
        "URI",
        realSignature
      );

      // some user want to buy a NFT

      let tx = marketplace.connect(bidder1).buyItemFixedPrice(1);
      await expect(tx).to.be.revertedWith(invalidItemStatus);

      const balanceBefore = await weth.balanceOf(await bidder3.getAddress());
      const ownerBalanceBefore = await weth.balanceOf(
        await signers[6].getAddress()
      );

      tx = marketplace.connect(bidder3).buyItemFixedPrice(0);
      await expect(tx).to.emit(marketplace, "BoughtFixedPrice");

      const balanceAfter = await weth.balanceOf(await bidder3.getAddress());
      const actualOwner = await asset721.ownerOf(0);

      expect(actualOwner).to.be.eq(await bidder3.getAddress());
      expect(balanceBefore.sub(balanceAfter)).to.be.eq(100);

      expect(await weth.balanceOf(marketplace.address)).to.be.eq(3); // COMISSION

      expect(await weth.balanceOf(await signers[6].getAddress())).to.be.eq(
        ownerBalanceBefore.add(97)
      );
    });

    it("Buying ERC1155 item...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset1155.address,
          0,
          100,
          3000,
          1250,
          2,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // price
        0, // tokenId
        3000, // amount
        1250, // feeNumerator
        2, // type
        "URI",
        realSignature
      );

      // some user wants to buy a batch of NFTs

      await marketplace.connect(bidder3).buyItemFixedPrice(0);

      const balance = await asset1155.balanceOf(await bidder3.getAddress(), 0);
      expect(balance).eq(3000);
    });
  });

  describe("Common funcs", function () {
    it("Setting comission", async () => {
      const currentComission = await marketplace.comission();

      await marketplace.setComission(33);

      const newComission = await marketplace.comission();

      expect(newComission).to.not.be.eq(currentComission);

      expect(newComission).to.be.eq(33);
    });

    it("Setting validator", async () => {
      const currentValidator = await marketplace.validator();

      await marketplace.setValidator(await signers[2].getAddress());

      const newValidator = await marketplace.validator();

      expect(newValidator).to.not.be.eq(currentValidator);

      expect(newValidator).to.be.eq(await signers[2].getAddress());
    });

    it("Checking if marketplace is ERC721 receiver", async () => {
      const expectedSelector = "0x150b7a02"; // onERC721Received(address,address,uint256,bytes)

      const data = ethers.utils.toUtf8Bytes("");
      const actualSelector = await marketplace.onERC721Received(
        await signers[2].getAddress(),
        await signers[2].getAddress(),
        0,
        data
      );

      expect(actualSelector).to.be.eq(expectedSelector);
    });

    it("Checking if marketplace is ERC1155 receiver", async () => {
      const expectedSelectorSingle = "0xf23a6e61"; // onERC1155Received(address,address,uint256,uint256,bytes)

      const data = ethers.utils.toUtf8Bytes("");
      const actualSelectorSingle = await marketplace.onERC1155Received(
        await signers[2].getAddress(),
        await signers[2].getAddress(),
        0,
        0,
        data
      );

      expect(actualSelectorSingle).to.be.eq(expectedSelectorSingle);

      const expectedSelectorBatch = "0xbc197c81"; // onERC1155BatchReceived(address,address,uint256[],uint256[],bytes)
      const actualSelectorBatch = await marketplace.onERC1155BatchReceived(
        await signers[2].getAddress(),
        await signers[2].getAddress(),
        [0],
        [0],
        data
      );

      expect(actualSelectorBatch).to.be.eq(expectedSelectorBatch);
    });

    it("Check if marketplace implements ERC165", async () => {
      const selector = "0x01ffc9a7"; // supportsInterface(bytes4)

      const flag = await marketplace.supportsInterface(selector);

      expect(flag).to.be.true;
    });

    it("withdraw weth from marketplace", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset1155.address,
          0,
          100,
          3000,
          1250,
          2,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // price
        0, // tokenId
        3000, // amount
        1250, // feeNumerator
        2, // type
        "URI",
        realSignature
      );

      await marketplace.connect(bidder3).buyItemFixedPrice(0);

      message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint16", // feeNumerator
          "uint8", // asset type
          "string", // uri
          "address", // msg.sender
        ],
        [
          asset1155.address,
          1,
          100,
          3000,
          1250,
          2,
          "URI",
          await signers[6].getAddress(),
        ]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // price
        1, // tokenId
        3000, // amount
        1250, // feeNumerator
        2, // type
        "URI",
        realSignature
      );

      await marketplace.connect(bidder3).buyItemFixedPrice(1);

      // receive funds
      const expectedComissions = await weth.balanceOf(marketplace.address);
      const realComissions = await marketplace.totalComissions();

      expect(expectedComissions).eq(realComissions);
      expect(expectedComissions).eq(6);

      let tx = marketplace.connect(signers[6]).withdrawComission();
      await expect(tx).revertedWith("Ownable: caller is not the owner");

      tx = marketplace.withdrawComission();
      await expect(tx).not.reverted;

      const balanceOwner = await weth.balanceOf(await signers[0].getAddress());
      expect(balanceOwner).eq(6);
    });
  });
});
