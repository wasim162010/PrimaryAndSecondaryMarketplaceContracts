import { expect } from "chai";
import { beforeEach } from "mocha";

import { ethers, network } from "hardhat";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import {
  SecondaryMarketplace,
  AssetERC1155,
  AssetERC721,
  ERC20,
} from "../../typechain";

describe("Secondary marketplace", function () {
  let marketplace: SecondaryMarketplace;
  let weth: ERC20;

  let asset721: AssetERC721;
  let asset1155: AssetERC1155;

  let signers: SignerWithAddress[];
  let validator: SignerWithAddress;
  let holder: SignerWithAddress;
  let bidder3: SignerWithAddress;

  const invalidSignature: string = "InvalidSignature()";
  const onlyOwner: string = "OnlyOwnerRequired()";
  const invalidItemStatus: string = "InvalidItemStatus()";

  beforeEach(async () => {
    signers = await ethers.getSigners();
    validator = signers[1];
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
      "SecondaryMarketplace"
    );
    marketplace = await marketplaceFactory.deploy();
    await marketplace.deployed();

    await marketplace.initialize(await validator.getAddress(), 5);

    const asset721Factory = await ethers.getContractFactory("AssetERC721");
    asset721 = await asset721Factory.deploy();
    await asset721.deployed();

    await asset721.initialize(
      "name",
      "symbol",
      await signers[0].getAddress(),
      marketplace.address
    );

    await asset721.mint(
      signers[0].address,
      signers[6].address,
      500,
      "some_uri"
    );

    await asset721.connect(signers[6]).approve(marketplace.address, 0);

    const asset1155Factory = await ethers.getContractFactory("AssetERC1155");
    asset1155 = await asset1155Factory.deploy();
    await asset1155.deployed();

    await asset1155.initialize(
      "uri",
      await signers[0].getAddress(),
      marketplace.address
    );

    const data = ethers.utils.arrayify(
      ethers.utils.solidityKeccak256(["string"], [""])
    );
    await asset1155.mint(
      signers[0].address,
      signers[6].address,
      0,
      33,
      data,
      500
    );

    await asset1155
      .connect(signers[6])
      .setApprovalForAll(marketplace.address, true);

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
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 7, 1, await signers[6].getAddress()]
      );
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.listAuction(
        asset721.address,
        5, // startPrice
        1, // tokenId
        7, // amount
        1, // type
        fakeSignature
      );
      await expect(tx).to.be.revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );
      await expect(tx).emit(marketplace, "ListedAuction");

      // getter for auction items
      const [asset, price, tokenId, amount, seller, assetType, status] =
        await marketplace.getAuctionItem(0);

      expect(asset).eq(asset721.address);
      expect(price).eq(5);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(assetType).eq(1);
      expect(status).to.be.eq(1);

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(marketplace.address);

      const itemId = await marketplace.auctionItemId();
      expect(itemId).eq(1);
    });

    it("Cancel listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // seller decided to cancel listing

      let tx = marketplace.connect(signers[6]).cancelAuction(1);
      await expect(tx).revertedWith(invalidItemStatus);

      tx = marketplace.cancelAuction(0);
      await expect(tx).revertedWith(onlyOwner);

      tx = marketplace.connect(signers[6]).cancelAuction(0);
      await expect(tx).emit(marketplace, "CanceledAuction");

      const [, , , , , , status] = await marketplace.getAuctionItem(0);
      const newOwner = await asset721.ownerOf(0);

      expect(status).to.be.eq(3);
      expect(newOwner).eq(signers[6].address);
    });

    it("Buying ERC721 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // some user wants to buy a NFT.

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [1, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      let fakesignature = await validator.signMessage(bytesArray);

      let tx = marketplace
        .connect(signers[6])
        .finishAuction(1, 100, bidder3.address, fakesignature);
      await expect(tx).revertedWith(invalidItemStatus);

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      fakesignature = await validator.signMessage(bytesArray);

      tx = marketplace
        .connect(signers[5])
        .finishAuction(0, 100, bidder3.address, fakesignature);
      await expect(tx).revertedWith(onlyOwner);

      const buyerBefore = await weth.balanceOf(bidder3.address);

      tx = marketplace
        .connect(signers[6])
        .finishAuction(0, 100, bidder3.address, fakesignature);
      await expect(tx).emit(marketplace, "FinishedAuction");

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(bidder3.address); // transfer check

      const buyerAfter = await weth.balanceOf(bidder3.address);

      expect(buyerBefore.sub(buyerAfter)).eq(100);
      expect(await weth.balanceOf(marketplace.address)).to.be.eq(5); // comission is set to 5%

      expect(await weth.balanceOf(signers[0].address)).eq(5); // royalty is set to 5%

      expect(await weth.balanceOf(signers[6].address)).eq(90); // 100 - 5(comission) -5(royalty)

      const [, , , , , , status] = await marketplace.getAuctionItem(0);
      expect(status).to.be.eq(2);
    });

    it("Buying ERC1155 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset1155.address, 0, 5, 33, 2, await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listAuction(
        asset1155.address,
        5, // startPrice
        0, // tokenId
        33, // amount
        2, // type
        realSignature
      );

      // some user wants to buy a batch of NFTs

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      await marketplace
        .connect(signers[6])
        .finishAuction(0, 100, bidder3.address, realSignature);

      const buyerBalance = await asset1155.balanceOf(bidder3.address, 0);
      expect(buyerBalance).eq(33);
    });
  });

  describe("BEST OFFER", function () {
    it("Listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 7, 1, signers[6].address]
      );
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        5, // startPrice
        1, // tokenId
        7, // amount
        1, // type
        fakeSignature
      );
      await expect(tx).to.be.revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );
      await expect(tx).emit(marketplace, "ListedOffer");

      // getter for auction items
      const [asset, tokenId, amount, seller, assetType, status] =
        await marketplace.getOfferItem(0);

      expect(asset).eq(asset721.address);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(assetType).eq(1);
      expect(status).to.be.eq(1);

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(marketplace.address);

      const itemId = await marketplace.offerItemId();
      expect(itemId).eq(1);
    });

    it("Cancel listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // seller decided to cancel listing

      let tx = marketplace.unlistOfferItem(0);
      await expect(tx).revertedWith(onlyOwner);

      tx = marketplace.connect(signers[6]).unlistOfferItem(1);
      await expect(tx).revertedWith(invalidItemStatus);

      tx = marketplace.connect(signers[6]).unlistOfferItem(0);
      await expect(tx).emit(marketplace, "UnlistedOffer");

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(signers[6].address);

      const [, , , , , status] = await marketplace.getOfferItem(0);
      expect(status).eq(3);
    });

    it("Buying ERC721 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // some user wants to buy a NFT

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [1, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      let fakesignature = await validator.signMessage(bytesArray);

      let tx = marketplace
        .connect(signers[6])
        .acceptOffer(1, 100, bidder3.address, fakesignature);
      await expect(tx).revertedWith(invalidItemStatus);

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      fakesignature = await validator.signMessage(bytesArray);

      tx = marketplace
        .connect(signers[5])
        .acceptOffer(0, 100, bidder3.address, fakesignature);
      await expect(tx).revertedWith(onlyOwner);

      const buyerBefore = await weth.balanceOf(bidder3.address);
      const royaltyReceiverBefore = await weth.balanceOf(signers[0].address);
      const sellerBefore = await weth.balanceOf(signers[6].address);

      tx = marketplace
        .connect(signers[6])
        .acceptOffer(0, 100, bidder3.address, fakesignature);
      await expect(tx).emit(marketplace, "AcceptedOffer");

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(bidder3.address); // transfer check

      const buyerAfter = await weth.balanceOf(bidder3.address);

      expect(buyerBefore.sub(buyerAfter)).eq(100);
      expect(await weth.balanceOf(marketplace.address)).to.be.eq(5); // comission is set to 5%

      const royaltyReceiverAfter = await weth.balanceOf(signers[0].address);
      expect(royaltyReceiverAfter.sub(royaltyReceiverBefore)).eq(5); // royalty is set to 5%

      const sellerAfter = await weth.balanceOf(signers[6].address);
      expect(sellerAfter.sub(sellerBefore)).eq(90); // 100 - 5(comission) -5(royalty)

      const [, , , , , status] = await marketplace.getOfferItem(0);
      expect(status).eq(2);
    });

    it("Buying ERC1155 item...", async () => {
      let message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset1155.address, 0, 5, 33, 2, await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listOfferItem(
        asset1155.address,
        5, // startPrice
        0, // tokenId
        33, // amount
        2, // type
        realSignature
      );

      // some user wants to buy a NFT

      message = ethers.utils.solidityKeccak256(
        [
          "uint256", // itemId
          "uint256", // bid
          "address", // buyer
        ],
        [0, 100, bidder3.address]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      await marketplace
        .connect(signers[6])
        .acceptOffer(0, 100, bidder3.address, realSignature);

      const buyerBalance = await asset1155.balanceOf(bidder3.address, 0);
      expect(buyerBalance).eq(33);
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
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      const fakeMessage = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 7, 1, signers[6].address]
      );
      const bytesArrayFake = ethers.utils.arrayify(fakeMessage);
      const fakeSignature = await validator.signMessage(bytesArrayFake);

      let tx = marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        5, // startPrice
        1, // tokenId
        7, // amount
        1, // type
        fakeSignature
      );
      await expect(tx).to.be.revertedWith(invalidSignature);

      tx = marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );
      await expect(tx).emit(marketplace, "ListedFixedPrice");

      // getter for auction items
      const [asset, price, tokenId, amount, seller, assetType, status] =
        await marketplace.getFixedPriceItem(0);

      expect(asset).eq(asset721.address);
      expect(price).eq(5);
      expect(tokenId).eq(0);
      expect(amount).eq(1);
      expect(seller).eq(await signers[6].getAddress());
      expect(assetType).eq(1);
      expect(status).to.be.eq(1);

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(signers[6].address);

      const itemId = await marketplace.fixedItemId();
      expect(itemId).eq(1);
    });

    it("Cancel listing...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 5, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        5, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // seller decided to cancel listing

      let tx = marketplace.unlistItemFixedPrice(0);
      await expect(tx).revertedWith(onlyOwner);

      tx = marketplace.connect(signers[6]).unlistItemFixedPrice(1);
      await expect(tx).revertedWith(invalidItemStatus);

      tx = marketplace.connect(signers[6]).unlistItemFixedPrice(0);
      await expect(tx).emit(marketplace, "UnlistedFixedPrice");

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(signers[6].address);
    });

    it("Buying ERC721 item...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset721.address, 0, 100, 1, 1, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset721.address,
        100, // startPrice
        0, // tokenId
        1, // amount
        1, // type
        realSignature
      );

      // some user wants to buy a NFT

      let tx = marketplace.connect(signers[6]).buyItemFixedPrice(1);
      await expect(tx).revertedWith(invalidItemStatus);

      const buyerBefore = await weth.balanceOf(bidder3.address);
      const royaltyReceiverBefore = await weth.balanceOf(signers[0].address);
      const sellerBefore = await weth.balanceOf(signers[6].address);

      tx = marketplace.connect(bidder3).buyItemFixedPrice(0);
      await expect(tx).emit(marketplace, "BoughtFixedPrice");

      const newOwner = await asset721.ownerOf(0);
      expect(newOwner).eq(bidder3.address); // transfer check

      const buyerAfter = await weth.balanceOf(bidder3.address);

      expect(buyerBefore.sub(buyerAfter)).eq(100);
      expect(await weth.balanceOf(marketplace.address)).to.be.eq(5); // comission is set to 5%

      const royaltyReceiverAfter = await weth.balanceOf(signers[0].address);
      expect(royaltyReceiverAfter.sub(royaltyReceiverBefore)).eq(5); // royalty is set to 5%

      const sellerAfter = await weth.balanceOf(signers[6].address);
      expect(sellerAfter.sub(sellerBefore)).eq(90); // 100 - 5(comission) -5(royalty)

      const [, , , , , , status] = await marketplace.getFixedPriceItem(0);
      expect(status).eq(2);
    });

    it("Buying ERC1155 item...", async () => {
      const message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset1155.address, 0, 100, 33, 2, await signers[6].getAddress()]
      );
      const bytesArray = ethers.utils.arrayify(message);
      const realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // startPrice
        0, // tokenId
        33, // amount
        2, // type
        realSignature
      );

      // some user wants to buy a batch of NFTs

      await marketplace.connect(bidder3).buyItemFixedPrice(0);

      const buyerBalance = await asset1155.balanceOf(bidder3.address, 0);
      expect(buyerBalance).eq(33);
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
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset1155.address, 0, 100, 15, 2, await signers[6].getAddress()]
      );
      let bytesArray = ethers.utils.arrayify(message);
      let realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // price
        0, // tokenId
        15, // amount
        2, // type
        realSignature
      );

      let balanceBefore = await weth.balanceOf(bidder3.address);

      await marketplace.connect(bidder3).buyItemFixedPrice(0);

      // 15 tokens to buyer (bidder3)
      // 18 tokens still to seller (signers[6])

      let balance = await asset1155.balanceOf(bidder3.address, 0);
      expect(balance).eq(15);

      balance = await asset1155.balanceOf(signers[6].address, 0);
      expect(balance).eq(18);

      let balanceAfter = await weth.balanceOf(bidder3.address);
      expect(balanceBefore.sub(balanceAfter)).eq(100);

      message = ethers.utils.solidityKeccak256(
        [
          "address", // asset
          "uint128", // tokenId
          "uint96", // startPrice
          "uint128", // amount
          "uint8", // asset type
          "address", // msg.sender
        ],
        [asset1155.address, 0, 100, 18, 2, await signers[6].getAddress()]
      );
      bytesArray = ethers.utils.arrayify(message);
      realSignature = await validator.signMessage(bytesArray);

      await marketplace.connect(signers[6]).listItemFixedPrice(
        asset1155.address,
        100, // price
        0, // tokenId
        18, // amount
        2, // type
        realSignature
      );

      await marketplace.connect(bidder3).buyItemFixedPrice(1);

      // receive funds
      const expectedComissions = await weth.balanceOf(marketplace.address);
      const realComissions = await marketplace.totalComissions();

      expect(expectedComissions).eq(realComissions);
      expect(expectedComissions).eq(10);

      let tx = marketplace.connect(signers[6]).withdrawComission();
      await expect(tx).revertedWith("Ownable: caller is not the owner");

      balanceBefore = await weth.balanceOf(await signers[0].getAddress());

      tx = marketplace.withdrawComission();
      await expect(tx).not.reverted;

      balanceAfter = await weth.balanceOf(await signers[0].getAddress());
      expect(balanceAfter.sub(balanceBefore)).eq(10);
    });
  });
});
