import { ethers } from "hardhat";

async function main() {
  const deployer = await ethers.getSigner("0x61b0905cbB94e77e048d07E0ceb81a2a8C3bAeE8");

  const validator = "0x73521Ee70E5f126921DC8BE247B87Aabe2f14c2B";
  const marketplace = "0xFe36C17B33D107da9adf3b44f0D6FC0c811de606"
  const uri = "someuri.com/tokenUris/";

  const Factory = await ethers.getContractFactory("AssetERC1155");
  const asset = await Factory.connect(deployer).deploy();
  await asset.deployed();

  await asset.initialize(
    uri,
    validator,
    marketplace
  );

  console.log("Asset1155 deployed to:", asset.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
